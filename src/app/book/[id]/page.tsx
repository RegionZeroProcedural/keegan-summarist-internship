"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useLibrary } from "@/hooks/useLibrary";
import { saveLibraryBook, removeLibraryBook } from "@/lib/library";
import {
    FiBookOpen,
    FiBookmark,
    FiClock,
    FiMic,
    FiStar,
} from "react-icons/fi";
import { AiOutlineBulb } from "react-icons/ai";

interface BookData {
    id: string;
    author: string;
    title: string;
    subTitle: string;
    imageLink: string;
    audioLink: string;
    totalRating: number;
    averageRating: number;
    keyIdeas: number;
    type: string;
    status: string;
    subscriptionRequired: boolean;
    summary: string;
    tags: string[];
    bookDescription: string;
    authorDescription: string;
}

// The Suspense boundary is required for useParams() in this Next.js setup.
export default function BookPage() {
    return (
        <Suspense fallback={<BookPageSkeleton />}>
            <BookPageContent />
        </Suspense>
    );
}

function BookPageContent() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [book, setBook] = useState<BookData | null>(null);
    const [doneLoading, setDoneLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [duration, setDuration] = useState("--:--");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [loginPromptActive, setLoginPromptActive] = useState(false);
    const openLogin = useCallback(() => setLoginPromptActive(true), []);
    const closeLogin = useCallback(() => setLoginPromptActive(false), []);
    const { user, loading, isGuest } = useAuth();

    const {
        isSubscribed,
        loading: subscriptionLoading,
        error: subscriptionError,
    } = useSubscription();

    const { books: libraryBooks, loading: libraryLoading } = useLibrary();
    // A demo login is still an authenticated Firebase user. Only library
    // editing stays read-only for the shared demo account.
    const loggedIn = !loading && user !== null && !user.isAnonymous;
    const isSaved = Boolean(book && libraryBooks.some((item) => item.id === book.id));

    // The assignment requires authentication for BOTH free and premium books.
    // Only premium books require an active/trialing subscription.
    const accessLoading = loading || Boolean(loggedIn && book?.subscriptionRequired && subscriptionLoading);
    const subscriptionUnavailable = Boolean(loggedIn && book?.subscriptionRequired && subscriptionError);

    function openPlayerOrPrompt() {
        if (!book || accessLoading) return;

        if (!loggedIn) {
            openLogin();
            return;
        }

        if (book.subscriptionRequired) {
            if (subscriptionUnavailable) return; // Do not guess access when Firestore is unavailable.
            if (!isSubscribed) {
                router.push("/choose-plan");
                return;
            }
        }

        router.push(`/player/${encodeURIComponent(book.id)}`);
    }

    async function toggleSave() {
        if (!book) return;
        if (!user || isGuest) {
            openLogin();
            return;
        }
        if (saving || libraryLoading) return;
        setSaving(true);
        setSaveError(null);
        try {
            if (isSaved) {
                await removeLibraryBook(user, book.id);
            } else {
                await saveLibraryBook(user, book);
            }
        } catch (reason) {
            console.error("Unable to update My Library:", reason);
            setSaveError(reason instanceof Error ? reason.message : "Unable to update your library.");
        } finally {
            setSaving(false);
        }
    }

    // Fetch one book, not the complete recommended/suggested feed.
    useEffect(() => {
        const controller = new AbortController();

        async function loadBook() {
            setDoneLoading(false);
            setBook(null);
            setError(null);
            setDuration("--:--");
            setSaveError(null);

            try {
                const response = await axios.get<BookData>(
                    "https://us-central1-summaristt.cloudfunctions.net/getBook",
                    {
                        params: { id },
                        signal: controller.signal,
                    }
                );

                if (!response.data?.id) {
                    throw new Error("Book not found");
                }

                if (!controller.signal.aborted) {
                    setBook(response.data);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error ? err.message : "Failed to load book"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setDoneLoading(true);
                }
            }
        }

        void loadBook();
        return () => controller.abort();
    }, [id]);

    // Load metadata for this book's audio duration.
    useEffect(() => {
        if (!book?.audioLink) return;

        const audio = new Audio();
        audio.preload = "metadata";

        function handleMetadata() {
            if (!Number.isFinite(audio.duration)) return;

            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            setDuration(
                `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
        }

        audio.addEventListener("loadedmetadata", handleMetadata);
        audio.src = book.audioLink;
        audio.load();

        return () => {
            audio.removeEventListener("loadedmetadata", handleMetadata);
            audio.pause();
            audio.removeAttribute("src");
        };
    }, [book?.audioLink]);

    if (!doneLoading) return <BookPageSkeleton />;

    if (error || !book) {
        return (
            <main className="mx-auto w-full max-w-[84rem] px-5 py-12 text-[#173c52] sm:px-8">
                <h1 className="text-2xl font-bold">Unable to load this book</h1>
                <p className="mt-2 text-red-600">{error ?? "Book not found."}</p>
                <Link href="/for-you" className="mt-5 inline-block text-[#0877f9] hover:underline">
                    Back to For You
                </Link>
            </main>
        );
    }

    return (
        // Content only: your existing dashboard layout supplies the header/sidebar.
        <main className="w-full min-w-0 px-5 pb-20 pt-10 text-[#173c52] sm:px-8 lg:px-12">
            <div className="mx-auto grid w-full max-w-[84rem] grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
                {/* Book details / description */}
                <div className="min-w-0">
                    <h1 className="max-w-[47rem] text-[2.4rem] font-bold leading-[1.25] tracking-[-0.025em]">
                        {book.title}
                    </h1>

                    <p className="mt-4 text-base text-[1.25rem] font-bold">{book.author}</p>
                    <p className="mt-3 text-[clamp(1.125rem,3vw,1.5rem)] font-extralight leading-snug">
                        {book.subTitle}
                    </p>

                    {/* The horizontal dividers and two-column stats match the reference. */}
                    <div className="mt-5 border-y border-[#e2e6e9] py-4">
                        <div className="grid max-w-[29rem] grid-cols-1 gap-x-8 gap-y-3 min-[400px]:grid-cols-2">
                            <div className="flex items-center gap-2 text-[0.95rem] font-medium">
                                <FiStar className="shrink-0 text-[1.6rem]" aria-hidden="true" />
                                <span className="text-base font-semibold sm:text-[1.1rem]">
                                    {book.averageRating.toFixed(1)} ({book.totalRating} ratings)
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[0.95rem] font-medium">
                                <FiClock className="shrink-0 text-[1.6rem]" aria-hidden="true" />
                                <span className="text-base font-semibold sm:text-[1.1rem]">{duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[0.95rem] font-medium">
                                <FiMic className="shrink-0 text-[1.6rem]" aria-hidden="true" />
                                <span className="text-base font-semibold sm:text-[1.1rem]">Audio &amp; Text</span>
                            </div>
                            <div className="flex items-center gap-2 text-[0.95rem] font-medium">
                                <AiOutlineBulb className="shrink-0 text-[1.8rem] translate-x-[-0.1rem]" aria-hidden="true" />
                                <span className="text-base font-semibold sm:text-[1.1rem]">{book.keyIdeas} Key ideas</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                        <button
                            type="button"
                            onClick={openPlayerOrPrompt}
                            disabled={accessLoading || subscriptionUnavailable}
                            className="flex h-[3.8rem] min-w-0 w-full items-center justify-center sm:w-auto sm:min-w-[12.5rem] gap-3 rounded-[0.25rem] bg-[#173c52] px-6 text-[1.2rem] font-medium text-white transition hover:bg-[#245b78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0877f9] disabled:cursor-wait disabled:opacity-60"
                        >
                            <FiBookOpen className="text-[1.5rem]" aria-hidden="true" />
                            Read
                        </button>
                        <button
                            type="button"
                            onClick={openPlayerOrPrompt}
                            disabled={accessLoading || subscriptionUnavailable}
                            className="flex h-[3.8rem] min-w-0 w-full items-center justify-center sm:w-auto sm:min-w-[12.5rem] gap-3 rounded-[0.25rem] bg-[#173c52] px-6 text-[1.2rem] font-medium text-white transition hover:bg-[#245b78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0877f9] disabled:cursor-wait disabled:opacity-60"
                        >
                            <FiMic className="text-[1.5rem]" aria-hidden="true" />
                            Listen
                        </button>
                    </div>
                    {subscriptionUnavailable && (
                        <p role="alert" className="mt-3 text-sm text-red-600">
                            Unable to verify your subscription right now. Please try again shortly.
                        </p>
                    )}

                    {/* Saved titles are persisted in the signed-in user's Firestore library. */}
                    <button
                        type="button"
                        onClick={() => void toggleSave()}
                        disabled={saving || Boolean(user && !isGuest && libraryLoading)}
                        aria-pressed={isSaved}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 text-[1.1rem] font-medium text-[#0877f9] hover:underline disabled:cursor-wait disabled:opacity-60"
                    >
                        <FiBookmark className="text-[1.6rem]" aria-hidden="true" />
                        <div className="text-[1.3rem] font-semibold">
                            {saving ? "Saving..." : isSaved ? "Remove from My Library" : "Add title to My Library"}
                        </div>
                    </button>
                    {saveError && <p role="alert" className="mt-2 text-sm text-red-600">{saveError}</p>}

                    <section className="mt-10">
                        <h2 className="text-[1.5rem] font-bold">What&apos;s it about?</h2>

                        {book.tags?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {book.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-[0.2rem] bg-[#f0f2f2] px-4 py-3 text-[1.1rem] font-semibold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="mt-5 whitespace-pre-line text-base leading-relaxed sm:text-[1.25rem]">
                            {book.bookDescription}
                        </p>
                    </section>

                    <section className="mt-10">
                        <h2 className="text-[1.5rem] font-bold">About the author</h2>
                        <p className="mt-4 whitespace-pre-line text-base leading-relaxed sm:text-[1.2rem]">
                            {book.authorDescription}
                        </p>
                    </section>
                </div>

                {/* Book art, at the top-right on desktop and on top on mobile. */}
                <aside className="order-first flex justify-center lg:order-none lg:justify-end">
                    {/* The cover and semicircle are already combined in the source image.
                        Give the entire artwork a larger square canvas, preserving its native proportions. */}
                    <div className="relative aspect-square w-full max-w-[24rem]">
                        <Image
                            src={book.imageLink}
                            alt={`Cover of ${book.title}`}
                            fill
                            sizes="(max-width: 1023px) 100vw, 24rem"
                            priority
                            className="object-contain object-top"
                        />
                    </div>
                </aside>
            </div>
            {loginPromptActive && <LoginModal isOpen={loginPromptActive} onClose={closeLogin} />}
        </main>
    );
}

function BookPageSkeleton() {
    return (
        <main className="w-full px-5 pb-20 pt-10 sm:px-8 lg:px-12">
            <div className="mx-auto grid w-full max-w-[84rem] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
                <div className="animate-pulse space-y-5">
                    <div className="h-10 w-4/5 rounded bg-slate-200" />
                    <div className="h-5 w-1/3 rounded bg-slate-200" />
                    <div className="h-7 w-2/3 rounded bg-slate-200" />
                    <div className="mt-8 h-24 rounded bg-slate-100" />
                    <div className="h-12 w-80 max-w-full rounded bg-slate-200" />
                    <div className="mt-10 h-5 w-1/3 rounded bg-slate-200" />
                    <div className="h-32 rounded bg-slate-100" />
                </div>
                <div className="order-first mx-auto aspect-square w-full max-w-[24rem] animate-pulse rounded bg-slate-200 lg:order-none" />
            </div>
        </main>
    );
}
