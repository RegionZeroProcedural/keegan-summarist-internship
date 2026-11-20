/** Shared audiobook duration utilities for book lists and My Library. */

const audioDurationRequests = new Map<string, Promise<number>>();
const bookAudioRequests = new Map<string, Promise<string>>();

/** Read an audiobook's actual duration from its media metadata. */
export function getAudioDuration(url: string): Promise<number> {
    if (!url) return Promise.reject(new Error("Audio URL is missing."));

    const cached = audioDurationRequests.get(url);
    if (cached) return cached;

    const request = new Promise<number>((resolve, reject) => {
        const audio = new Audio();
        audio.preload = "metadata";

        const timeout = window.setTimeout(() => {
            finish(new Error("Timed out loading audio metadata."));
        }, 15000);

        function cleanup() {
            window.clearTimeout(timeout);
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("error", onError);
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
        }

        function finish(error?: Error, seconds?: number) {
            cleanup();
            if (error) reject(error);
            else resolve(seconds!);
        }

        function onLoaded() {
            if (!Number.isFinite(audio.duration) || audio.duration < 0) {
                finish(new Error("Audio duration is unavailable."));
                return;
            }
            finish(undefined, audio.duration);
        }

        function onError() {
            finish(new Error("Failed to load audio metadata."));
        }

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("error", onError);
        audio.src = url;
        audio.load();
    });

    audioDurationRequests.set(url, request);
    // Allow a future retry after failures instead of caching an error forever.
    void request.catch(() => audioDurationRequests.delete(url));
    return request;
}

export function formatAudioDuration(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

/** Saved Firestore records intentionally omit audio URLs, so fetch book details. */
async function getBookAudioUrl(bookId: string): Promise<string> {
    const cached = bookAudioRequests.get(bookId);
    if (cached) return cached;

    const request = (async () => {
        const response = await fetch(
            `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(bookId)}`
        );
        if (!response.ok) throw new Error(`Unable to load book ${bookId}`);

        const book: unknown = await response.json();
        if (!book || typeof book !== "object" ||
            !("audioLink" in book) || typeof book.audioLink !== "string" || !book.audioLink
        ) {
            throw new Error(`Book ${bookId} has no audio URL.`);
        }
        return book.audioLink;
    })();

    bookAudioRequests.set(bookId, request);
    void request.catch(() => bookAudioRequests.delete(bookId));
    return request;
}

/** Use an already fetched guest URL when possible; otherwise fetch only that book. */
export async function getBookDuration(bookId: string, audioUrl?: string): Promise<string> {
    const url = audioUrl || await getBookAudioUrl(bookId);
    return formatAudioDuration(await getAudioDuration(url));
}
