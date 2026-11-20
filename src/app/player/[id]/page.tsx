"use client";

import { useState, useEffect, Suspense, useRef } from 'react';
import PlayerPageSkeleton from '../PlayerPageSkeleton';
import axios from 'axios';
import { useParams } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthContext";
import { setLibraryBookFinished } from "@/lib/library";
import { RiReplay10Line } from "react-icons/ri";
import { RiForward10Line } from "react-icons/ri";

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

export default function MediaPlayer() {
    return (
        <Suspense fallback={<PlayerPageSkeleton />}>
            <MediaPlayerContent />
        </Suspense>
    );
}

function MediaPlayerContent() {
    const { id } = useParams<{ id: string }>();
    const audioRef = useRef<HTMLAudioElement>(null);
    const { user, isGuest } = useAuth();

    async function togglePlayback() {
        const audio = audioRef.current;

        if (!audio || !audioAvailable) return;

        if (audio.paused) {
            try {
                setAudioError(null);
                await audio.play();
            } catch (error) {
                console.error("Audio playback failed:", error);
                setAudioError("Unable to start audio playback.");
            }
        } else {
            audio.pause();
        }
    }

    const [book, setBook] = useState<BookData | null>(null);
    const [doneLoading, setDoneLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [durationSeconds, setDurationSeconds] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    // Never wait for book metadata before rendering the player controls.
    const activeBook = book?.id === id ? book : null;
    const audioAvailable = Boolean(activeBook?.audioLink) && !audioError;

    const progress =
    durationSeconds > 0
        ? (currentTime / durationSeconds) * 100
        : 0;

    // Fetch one book, not the complete recommended/suggested feed.
    useEffect(() => {
        const controller = new AbortController();

        async function loadBook() {
            setDoneLoading(false);
            setBook(null);
            setError(null);
            setCurrentTime(0);
            setDurationSeconds(0);
            setIsPlaying(false);
            setAudioError(null);

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


    function skip(seconds: number) {
        const audio = audioRef.current;

        if (!audio || !audioAvailable || durationSeconds <= 0) return;

        const newTime = audio.currentTime + seconds;

        audio.currentTime = Math.max(
            0,
            Math.min(newTime, durationSeconds || audio.currentTime)
        );

        setCurrentTime(audio.currentTime);
    }

    function seekTo(seconds: number) {
        const audio = audioRef.current;

        if (!audio || !audioAvailable || durationSeconds <= 0) return;

        const newTime = Math.max(
            0,
            Math.min(seconds, durationSeconds)
        );

        audio.currentTime = newTime;

        setCurrentTime(newTime);
    }

    function formatTime(seconds: number): string {
        if (!Number.isFinite(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    return (
    <>
        <audio
            ref={audioRef}
            key={id}
            src={activeBook?.audioLink || undefined}
            preload="auto"

            onLoadedMetadata={(event) => {
                const duration = event.currentTarget.duration;

                if (Number.isFinite(duration)) {
                    setDurationSeconds(duration);
                }
            }}

            onTimeUpdate={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
            }}

            onPlay={() => {
                setIsPlaying(true);
            }}

            onPause={() => {
                setIsPlaying(false);
            }}

            onEnded={() => {
                setIsPlaying(false);
                if (user && !isGuest && activeBook) {
                    void setLibraryBookFinished(user, activeBook, true).catch((reason) => {
                        console.error("Unable to mark book as finished:", reason);
                    });
                }
            }}

            onError={() => {
                setAudioError("Unable to load this book's audio.");
            }}
        />
            <div className="flex min-w-0 flex-col pb-5">
                <h1 className="mb-5 break-words text-[clamp(1.45rem,4.5vw,1.8rem)] font-bold sm:mb-8">
                    {activeBook?.title ?? (error ? "Unable to load this book" : "Loading book...")}
                </h1>
                <div className="mb-6 h-px w-full bg-gray-300 sm:mb-8" />
                <div
                    className="break-words whitespace-pre-line leading-relaxed transition-[font-size] duration-200"
                    style={{ fontSize: "var(--reader-font-size, 1rem)" }}
                >
                    {error ? (
                        <div role="alert">
                            <p>{error}</p>
                            <Link href="/for-you" className="mt-5 inline-block text-[#0877f9] hover:underline">Back to For You</Link>
                        </div>
                    ) : activeBook?.summary ?? (!doneLoading ? "Loading summary..." : "No summary available.")}
                </div>
            </div>

            {/* Mounted immediately, independently of the book API response. */}
            <div className="fixed inset-x-0 bottom-0 z-50 w-full border-t border-white/10 bg-[var(--primary)] pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-5px_25px_rgba(0,0,0,0.15)]">
                <div className="mx-auto flex w-full max-w-[100rem] min-w-0 flex-col gap-2 px-3 py-2 sm:px-5 lg:grid lg:min-h-[6rem] lg:grid-cols-[minmax(9rem,1fr)_auto_minmax(12rem,1fr)] lg:items-center lg:gap-5 lg:px-8">
                    {/* Current book information */}
                    <div className="flex min-w-0 items-center gap-3">
                        {activeBook?.imageLink ? (
                            <Image src={activeBook.imageLink} alt="Book cover" className="h-11 w-9 shrink-0 object-contain sm:h-14 sm:w-11 lg:h-16 lg:w-12" width={50} height={60} unoptimized />
                        ) : (
                            <div aria-hidden="true" className="h-11 w-9 shrink-0 rounded-sm bg-gray-500/30 sm:h-14 sm:w-11 lg:h-16 lg:w-12" />
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold sm:text-[1.05rem]">{activeBook?.title ?? "Loading book..."}</p>
                            <p className="mt-0.5 truncate text-xs text-gray-300 sm:text-sm">{activeBook?.author ?? ""}</p>
                        </div>
                    </div>

                    {/* Rewind, play/pause, forward are centered and touch-sized. */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-2">
                        <button type="button" onClick={() => skip(-10)} disabled={!audioAvailable || durationSeconds <= 0}
                            aria-label="Rewind 10 seconds"
                            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12">
                            <RiReplay10Line className="text-[2rem]" />
                        </button>
                        <button type="button" onClick={togglePlayback} disabled={!audioAvailable}
                            aria-label={isPlaying ? "Pause audio" : "Play audio"}
                            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-13 sm:w-13">
                            {isPlaying ? (
                                <span className="flex gap-1" aria-hidden="true"><span className="h-5 w-1.5 bg-[var(--primary)]"/><span className="h-5 w-1.5 bg-[var(--primary)]"/></span>
                            ) : (
                                <span aria-hidden="true" className="ml-1 h-0 w-0 border-y-[0.65rem] border-y-transparent border-l-[1rem] border-l-[var(--primary)]" />
                            )}
                        </button>
                        <button type="button" onClick={() => skip(10)} disabled={!audioAvailable || durationSeconds <= 0}
                            aria-label="Forward 10 seconds"
                            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12">
                            <RiForward10Line className="text-[2rem]" />
                        </button>
                    </div>

                    {/* Slider grows and shrinks with viewport; it never forces overflow. */}
                    <div className="flex min-w-0 w-full items-center gap-2.5 text-xs tabular-nums sm:gap-3 sm:text-sm">
                        <span className="w-[2.3rem] shrink-0 text-right">{formatTime(currentTime)}</span>
                        <div className="relative h-1.5 min-w-0 flex-1 rounded-full bg-gray-500">
                            <div className="h-full rounded-full bg-gray-200" style={{ width: `${progress}%` }} />
                            <div aria-hidden="true" className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: `${progress}%` }} />
                            <input
                                type="range" min={0} max={durationSeconds || 0} step={0.1}
                                value={Math.min(currentTime, durationSeconds)}
                                onChange={(event) => seekTo(Number(event.target.value))}
                                disabled={!audioAvailable || durationSeconds <= 0}
                                aria-label="Seek audio"
                                className="absolute left-0 top-1/2 h-10 w-full -translate-y-1/2 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                            />
                        </div>
                        <span className="w-[2.3rem] shrink-0">{formatTime(durationSeconds)}</span>
                    </div>
                </div>
            </div>
    </>
    );
}
