"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiBookmark, FiCheck, FiClock, FiTrash2 } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useLibrary } from "@/hooks/useLibrary";
import {
    removeLibraryBook,
    setLibraryBookFinished,
    type LibraryBook,
    type LibraryBookInput,
} from "@/lib/library";
import LoginModal from "@/components/LoginModal";
import { getBookDuration } from "@/lib/audioDuration";

// This is a read-only sample library for guests, not Firestore data.
// The two saved books and the first five finished books mirror the reference.
const DEMO_SAVED_IDS = ["18tro3gle2p", "5bxl50cz4bt"];
const DEMO_FINISHED_TITLES = [
    "How to Talk to Anyone",
    "Can't Hurt Me",
    "The Intelligent Investor",
    "Mastery",
    "How to Win Friends and Influence People in the Digital Age",
];

const BACKDROPS = ["#ffdf71", "#f66771", "#e8b8aa", "#d9cfc8", "#efcf5a"];

function backdropFor(book: LibraryBook): string {
    const title = book.title.toLowerCase();
    if (title.includes("talk to anyone")) return "#ffdc70";
    if (title.includes("win friends")) return "#f26470";
    if (title.includes("hurt me")) return "#d6d3ce";
    if (title.includes("intelligent investor")) return "#f6a3ad";
    if (title === "mastery") return "#f6d65c";

    const hash = [...book.id].reduce((total, character) => total + character.charCodeAt(0), 0);
    return BACKDROPS[hash % BACKDROPS.length];
}

function isApiBook(value: unknown): value is LibraryBookInput & { audioLink?: string } {
    if (!value || typeof value !== "object") return false;
    const book = value as Record<string, unknown>;
    return (
        typeof book.id === "string" &&
        typeof book.title === "string" &&
        typeof book.author === "string" &&
        typeof book.imageLink === "string"
    );
}

function asDemoBook(book: LibraryBookInput, isFinished: boolean): LibraryBook {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        subTitle: typeof book.subTitle === "string" ? book.subTitle : "",
        imageLink: book.imageLink,
        subscriptionRequired: Boolean(book.subscriptionRequired),
        averageRating: typeof book.averageRating === "number" ? book.averageRating : 0,
        isFinished,
    };
}

interface LibraryTileProps {
    book: LibraryBook;
    duration?: string;
    editable: boolean;
    pending: boolean;
    onRemove: (book: LibraryBook) => void;
    onToggleFinished: (book: LibraryBook) => void;
}

function LibraryTile({
    book,
    duration,
    editable,
    pending,
    onRemove,
    onToggleFinished,
}: LibraryTileProps) {
    return (
        <article className="group relative w-full max-w-[11.25rem] min-w-0 text-[#073249] sm:w-[11.25rem] sm:shrink-0">
            <div className="relative aspect-square w-full overflow-hidden sm:h-[11.25rem] sm:w-[11.25rem]">
                <Link
                    href={`/book/${encodeURIComponent(book.id)}`}
                    className="absolute inset-0 z-10 flex items-start justify-center focus-visible:outline-2 focus-visible:outline-green-500"
                    aria-label={`View ${book.title}`}
                >
                    <Image
                        src={book.imageLink}
                        alt={`Cover of ${book.title}`}
                        width={116}
                        height={174}
                        sizes="116px"
                        unoptimized
                        className="relative z-10 h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transition-none"
                    />
                </Link>

                {/* Hidden until hover/focus on desktop; visible on touch/mobile. */}
                {editable && (
                    <div className="absolute right-1.5 top-1.5 z-20 flex flex-col gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                        <button
                            type="button"
                            disabled={pending}
                            onClick={() => onToggleFinished(book)}
                            aria-label={book.isFinished ? `Mark ${book.title} unfinished` : `Mark ${book.title} finished`}
                            title={book.isFinished ? "Mark unfinished" : "Mark finished"}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#073249] shadow-md transition-colors hover:bg-[#b9f7d5] focus-visible:outline-2 focus-visible:outline-green-600 disabled:cursor-wait disabled:opacity-50"
                        >
                            <FiCheck aria-hidden="true" size={18} />
                        </button>
                        <button
                            type="button"
                            disabled={pending}
                            onClick={() => onRemove(book)}
                            aria-label={`Remove ${book.title} from My Library`}
                            title="Remove from library"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#073249] shadow-md transition-colors hover:bg-red-100 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-green-600 disabled:cursor-wait disabled:opacity-50"
                        >
                            <FiTrash2 aria-hidden="true" size={17} />
                        </button>
                    </div>
                )}
            </div>

            <Link href={`/book/${encodeURIComponent(book.id)}`} className="block hover:underline focus-visible:outline-2 focus-visible:outline-green-500">
                <h3 className="mt-2 line-clamp-3 text-[0.95rem] font-bold leading-[1.25rem]">
                    {book.title}
                </h3>
                <p className="mt-2 line-clamp-1 text-[0.91rem] text-[#9ba9b5]">
                    {book.author}
                </p>
                <p className="mt-2 line-clamp-2 text-[0.91rem] leading-[1.15rem] text-[#52606c]">
                    {book.subTitle}
                </p>
            </Link>

            <div className="mt-2 flex items-center gap-2 text-[0.85rem] text-[#8e9eab]">
                <FiClock aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span aria-label={duration && duration !== "--:--" ? "Book duration" : "Duration not available"}>
                    {duration ?? "--:--"}
                </span>
                <FaRegStar aria-hidden="true" className="ml-1 h-4 w-4 shrink-0" />
                <span>{book.averageRating > 0 ? book.averageRating.toFixed(1) : "—"}</span>
            </div>
        </article>
    );
}

interface LibrarySectionProps {
    title: string;
    durations: Record<string, string>;
    books: LibraryBook[];
    loading: boolean;
    editable: boolean;
    pendingId: string | null;
    onRemove: (book: LibraryBook) => void;
    onToggleFinished: (book: LibraryBook) => void;
}

function LibrarySection({
    title,
    durations,
    books,
    loading,
    editable,
    pendingId,
    onRemove,
    onToggleFinished,
}: LibrarySectionProps) {
    return (
        <section aria-label={title}>
            <h2 className="text-[1.5rem] font-bold leading-tight">{title}</h2>
            <p className="mt-3 text-[1rem] text-[#8596a4]" aria-live="polite">
                {loading ? "Loading..." : `${books.length} ${books.length === 1 ? "item" : "items"}`}
            </p>

            {loading ? (
                <div role="status" aria-label={`Loading ${title.toLowerCase()}`} className="mt-8 grid grid-cols-2 justify-items-center gap-x-3 gap-y-7 sm:mt-12 sm:flex sm:flex-wrap sm:justify-start sm:gap-x-8 sm:gap-y-9 sm:pl-3 lg:gap-x-12">
                    {Array.from({ length: title === "Saved Books" ? 2 : 5 }, (_, index) => (
                        <div key={index} className="w-full max-w-[11.25rem] min-w-0 animate-pulse sm:w-[11.25rem] sm:shrink-0">
                            <div className="aspect-square w-full rounded-md bg-gray-200" />
                            <div className="mt-3 h-4 w-full rounded bg-gray-200" />
                            <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                            <div className="mt-3 h-4 w-4/5 rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div className="mt-10 flex items-center gap-3 text-[#8596a4]">
                    <FiBookmark aria-hidden="true" className="h-5 w-5" />
                    <span>{title === "Saved Books" ? "No saved books yet. Add a book from its detail page." : "Books you finish will appear here."}</span>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-2 justify-items-center gap-x-3 gap-y-7 sm:mt-12 sm:flex sm:flex-wrap sm:justify-start sm:gap-x-8 sm:gap-y-9 sm:pl-3 lg:gap-x-12">
                    {books.map((book) => (
                        <LibraryTile
                            key={book.id}
                            book={book}
                            duration={durations[book.id]}
                            editable={editable}
                            pending={pendingId === book.id}
                            onRemove={onRemove}
                            onToggleFinished={onToggleFinished}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default function LibraryPage() {
    const { user, loading: authLoading, isGuest } = useAuth();
    const { books, loading: libraryLoading, error: libraryError } = useLibrary();
    const [guestSaved, setGuestSaved] = useState<LibraryBook[]>([]);
    const [guestFinished, setGuestFinished] = useState<LibraryBook[]>([]);
    const [guestAudioUrls, setGuestAudioUrls] = useState<Record<string, string>>({});
    const [knownDurations, setKnownDurations] = useState<Record<string, string>>({});
    const [guestLoading, setGuestLoading] = useState(false);
    const [guestError, setGuestError] = useState<string | null>(null);
    const [loginOpen, setLoginOpen] = useState(false);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const isRegistered = Boolean(user && !user.isAnonymous && !isGuest);

    useEffect(() => {
        if (!isGuest) return;
        const controller = new AbortController();

        async function loadGuestPreview() {
            setGuestLoading(true);
            setGuestError(null);
            try {
                const statuses = ["recommended", "suggested"];
                const results = await Promise.allSettled(
                    statuses.map(async (status) => {
                        const response = await fetch(
                            `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${status}`,
                            { signal: controller.signal },
                        );
                        if (!response.ok) throw new Error(`Unable to load ${status} books.`);
                        const data: unknown = await response.json();
                        if (!Array.isArray(data)) throw new Error("Unexpected preview data.");
                        return data.filter(isApiBook);
                    }),
                );
                if (controller.signal.aborted) return;

                const available = results.flatMap((result) =>
                    result.status === "fulfilled" ? result.value : [],
                );
                if (!available.length) throw new Error("Unable to load preview books.");

                const unique = new Map(available.map((book) => [book.id, book]));
                const allBooks = [...unique.values()];
                // Guest books arrive with their audio URLs; use those directly.
                const audioUrls: Record<string, string> = {};
                for (const book of allBooks) {
                    if (typeof book.audioLink === "string" && book.audioLink) {
                        audioUrls[book.id] = book.audioLink;
                    }
                }
                setGuestAudioUrls(audioUrls);

                const saved = DEMO_SAVED_IDS.map((id) => unique.get(id)).filter(
                    (book): book is LibraryBookInput => Boolean(book),
                );
                setGuestSaved((saved.length ? saved : allBooks.slice(0, 2)).map((book) => asDemoBook(book, false)));

                const preferred = DEMO_FINISHED_TITLES.map((title) =>
                    allBooks.find((book) => book.title.toLowerCase().replace(/[’]/g, "'") === title.toLowerCase()),
                ).filter((book): book is LibraryBookInput => Boolean(book));
                const remaining = allBooks.filter((book) => !preferred.some((selected) => selected.id === book.id));
                setGuestFinished([...preferred, ...remaining].slice(0, 13).map((book) => asDemoBook(book, true)));
            } catch (reason) {
                if (!controller.signal.aborted) {
                    setGuestError(reason instanceof Error ? reason.message : "Unable to load preview books.");
                }
            } finally {
                if (!controller.signal.aborted) setGuestLoading(false);
            }
        }

        void loadGuestPreview();
        return () => controller.abort();
    }, [isGuest]);

    // A finished book can appear in BOTH sections, matching the reference.
    const savedBooks = isGuest ? guestSaved : isRegistered ? books : [];
    const finishedBooks = isGuest ? guestFinished : isRegistered ? books.filter((book) => book.isFinished) : [];
    const loading = authLoading || (isGuest ? guestLoading : isRegistered && libraryLoading);
    const error = isGuest ? guestError : isRegistered ? libraryError : null;

    // Work from the unique visible book IDs so a finished+saved book loads
    // metadata only once. The stable ID string avoids triggering this effect
    // on every React render.
    const visibleIds = [...new Set([...savedBooks, ...finishedBooks].map((book) => book.id))]
        .sort()
        .join("|");

    useEffect(() => {
        if (!isGuest && !isRegistered) {
            setKnownDurations({});
            return;
        }

        const ids = visibleIds.split("|").filter(Boolean);
        if (!ids.length) {
            setKnownDurations({});
            return;
        }

        let cancelled = false;

        // Leave book cards visible while the audio metadata loads.
        // Firestore library documents do not store audio URLs; getBookDuration
        // fetches each book's URL and uses the same metadata function as
        // Recommended and Suggested.
        for (const id of ids) {
            void getBookDuration(id, isGuest ? guestAudioUrls[id] : undefined)
                .then((duration) => {
                    if (!cancelled) {
                        setKnownDurations((current) => ({ ...current, [id]: duration }));
                    }
                })
                .catch((reason: unknown) => {
                    console.warn(`Unable to retrieve duration for book ${id}:`, reason);
                    if (!cancelled) {
                        setKnownDurations((current) => ({ ...current, [id]: "--:--" }));
                    }
                });
        }

        return () => { cancelled = true; };
    }, [visibleIds, isGuest, isRegistered, guestAudioUrls]);

    async function removeBook(book: LibraryBook) {
        if (!user || !isRegistered || pendingId) return;
        setPendingId(book.id);
        setActionError(null);
        try {
            await removeLibraryBook(user, book.id);
        } catch (reason) {
            setActionError(reason instanceof Error ? reason.message : "Unable to remove book.");
        } finally {
            setPendingId(null);
        }
    }

    async function toggleFinished(book: LibraryBook) {
        if (!user || !isRegistered || pendingId) return;
        setPendingId(book.id);
        setActionError(null);
        try {
            await setLibraryBookFinished(user, book, !book.isFinished);
        } catch (reason) {
            setActionError(reason instanceof Error ? reason.message : "Unable to update book.");
        } finally {
            setPendingId(null);
        }
    }

    return (
        <div className="min-w-0 w-full text-[#073249] xl:-ml-8 xl:w-[calc(100%+4rem)]">
            {authLoading ? (
                <div role="status" aria-label="Loading account" className="space-y-5 animate-pulse">
                    <div className="h-8 w-48 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                </div>
            ) : !isGuest && !isRegistered ? (
                <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center px-1 pt-5 text-center sm:pt-10">
                    <Image
                        src="/assets/logo.png"
                        alt="Account login illustration"
                        width={780}
                        height={450}
                        unoptimized
                        className="mb-4 h-auto w-full max-w-[13rem] object-contain sm:mb-6 sm:max-w-[18rem]"
                    />
                    <h2 className="text-[clamp(1.1rem,3.7vw,1.35rem)] font-bold leading-snug">Log in to your account to see your library.</h2>
                    <button
                        type="button"
                        onClick={() => setLoginOpen(true)}
                        className="mt-5 min-h-11 w-full max-w-[12rem] rounded-md bg-[#28e486] px-6 font-semibold text-[1rem] text-[#073249] transition-colors hover:bg-[#20cc76] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073249]"
                    >
                        Log in
                    </button>
                </div>
            ) : (
                <>
                    {error && <p role="alert" className="mb-6 text-sm text-red-600">{error}</p>}
                    {actionError && <p role="alert" className="mb-6 text-sm text-red-600">{actionError}</p>}

                    {/* Both sections stay on screen; there are no tabs in the reference. */}
                    <LibrarySection
                        title="Saved Books"
                        books={savedBooks}
                        durations={knownDurations}
                        loading={loading}
                        editable={isRegistered}
                        pendingId={pendingId}
                        onRemove={(book) => void removeBook(book)}
                        onToggleFinished={(book) => void toggleFinished(book)}
                    />
                    <div className="mt-10">
                        <LibrarySection
                            title="Finished"
                            books={finishedBooks}
                            durations={knownDurations}
                            loading={loading}
                            editable={isRegistered}
                            pendingId={pendingId}
                            onRemove={(book) => void removeBook(book)}
                            onToggleFinished={(book) => void toggleFinished(book)}
                        />
                    </div>
                </>
            )}

            {loginOpen && <LoginModal isOpen onClose={() => setLoginOpen(false)} />}
        </div>
    );
}
