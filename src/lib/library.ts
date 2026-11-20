import { db } from "@/lib/firebase";
import { isGuestAccount } from "@/lib/guestAccount";
import type { User } from "firebase/auth";
import {
    doc,
    deleteDoc,
    runTransaction,
    serverTimestamp,
    type Timestamp,
} from "firebase/firestore";

/** Only public book metadata belongs in a reader's saved library. */
export interface LibraryBookInput {
    id: string;
    title: string;
    author: string;
    subTitle: string;
    imageLink: string;
    subscriptionRequired: boolean;
    averageRating: number;
}

export interface LibraryBook extends LibraryBookInput {
    isFinished: boolean;
    savedAt?: Timestamp;
    finishedAt?: Timestamp | null;
}

function readerLibraryRef(user: User, bookId: string) {
    if (user.isAnonymous || isGuestAccount(user)) {
        throw new Error("Guest accounts cannot change a personal library.");
    }
    if (!bookId || bookId.includes("/")) {
        throw new Error("Invalid book identifier.");
    }
    return doc(db, "users", user.uid, "library", bookId);
}

function libraryFields(book: LibraryBookInput): LibraryBookInput {
    // Never write full book summaries, audio URLs, or accidental extra fields.
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        subTitle: book.subTitle,
        imageLink: book.imageLink,
        subscriptionRequired: book.subscriptionRequired,
        averageRating: book.averageRating,
    };
}

/** Idempotent: never duplicates a title or overwrites its finished state. */
export async function saveLibraryBook(user: User, book: LibraryBookInput) {
    const ref = readerLibraryRef(user, book.id);
    await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(ref);
        if (existing.exists()) return;
        transaction.set(ref, {
            ...libraryFields(book),
            isFinished: false,
            savedAt: serverTimestamp(),
            finishedAt: null,
        });
    });
}

export async function removeLibraryBook(user: User, bookId: string) {
    await deleteDoc(readerLibraryRef(user, bookId));
}

/** Finishing an audio book adds it to the library even if it wasn't saved. */
export async function setLibraryBookFinished(
    user: User,
    book: LibraryBookInput,
    finished: boolean,
) {
    const ref = readerLibraryRef(user, book.id);
    await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(ref);
        transaction.set(ref, {
            ...libraryFields(book),
            ...(existing.exists() ? {} : { savedAt: serverTimestamp() }),
            isFinished: finished,
            finishedAt: finished ? serverTimestamp() : null,
        }, { merge: true });
    });
}
