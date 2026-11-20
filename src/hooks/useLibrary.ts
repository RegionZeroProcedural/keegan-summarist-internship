"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import type { LibraryBook } from "@/lib/library";

export function useLibrary() {
    const { user, loading: authLoading, isGuest } = useAuth();
    const [books, setBooks] = useState<LibraryBook[]>([]);
    const [loadedUid, setLoadedUid] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const uid = user && !isGuest ? user.uid : null;

    useEffect(() => {
        if (!uid) return;

        const unsubscribe = onSnapshot(
            collection(db, "users", uid, "library"),
            (snapshot) => {
                const next = snapshot.docs.map((entry) => ({
                    ...(entry.data() as Omit<LibraryBook, "id">),
                    id: entry.id,
                }));
                next.sort((a, b) =>
                    (b.savedAt?.toMillis() ?? 0) - (a.savedAt?.toMillis() ?? 0)
                );
                setBooks(next);
                setError(null);
                setLoadedUid(uid);
            },
            (reason) => {
                setError(reason.message);
                setLoadedUid(uid);
            },
        );
        return unsubscribe;
    }, [uid]);

    // Never expose a previous user's library while auth is changing.
    return {
        books: uid && loadedUid === uid ? books : [],
        loading: authLoading || (!!uid && loadedUid !== uid),
        error: uid && loadedUid === uid ? error : null,
    };
}
