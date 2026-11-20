"use client";

import Image from "next/image";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAudioDuration, formatAudioDuration } from "@/lib/audioDuration";

interface Book {
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


export default function FYCard() {

    const [doneLoading, setDoneLoading] = useState(false);

    const [book, setBook] = useState<Book | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [duration, setDuration] = useState("--:--");

    useEffect(() => {
        const controller = new AbortController();

        async function getBook() {
            console.log("Starting book request...");

            try {
                const response = await axios.get<Book[] | Book>(
                    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
                    { signal: controller.signal }
                );

                console.log("API RESPONSE:", response.data);

                const selectedBook = Array.isArray(response.data)
                    ? response.data[0]
                    : response.data;

                if (!selectedBook) {
                    throw new Error("No selected book found");
                }

                if (!controller.signal.aborted) {
                    setBook(selectedBook);
                    setError(null);
                }

            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("BOOK FETCH ERROR:", error);

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load book"
                    );
                }

            } finally {
                if (!controller.signal.aborted) {
                    setDoneLoading(true);
                }
            }
        }

        void getBook();

        return () => controller.abort();

    }, []);

    // Read the actual media duration just like Recommended/Suggested and My Library.
    useEffect(() => {
        const audioLink = book?.audioLink;
        if (!audioLink) {
            return;
        }

        let cancelled = false;
        setDuration("--:--");

        void getAudioDuration(audioLink)
            .then((seconds) => {
                if (!cancelled) setDuration(formatAudioDuration(seconds));
            })
            .catch(() => {
                if (!cancelled) setDuration("--:--");
            });

        return () => { cancelled = true; };
    }, [book?.audioLink]);

    return (
        <section className="w-full min-w-0">
            <h2 className="pb-4 text-[clamp(1.3rem,3.5vw,1.6rem)] font-bold text-[#073249]">
                Selected just for you
            </h2>
            {!doneLoading ? (
                <div role="status" aria-label="Loading selected book" className="w-full max-w-[42.5rem] rounded-md bg-[var(--reviewBG)] p-4 sm:p-6">
                    <div className="skeleton mb-6 h-6 w-3/4 bg-gray-200" />
                    <div className="flex items-center gap-4 sm:gap-7">
                        <div className="skeleton h-40 w-28 shrink-0 rounded bg-gray-200 sm:h-48 sm:w-36" />
                        <div className="min-w-0 flex-1 space-y-4">
                            <div className="skeleton h-6 w-5/6 bg-gray-200" />
                            <div className="skeleton h-5 w-2/3 bg-gray-200" />
                            <div className="skeleton h-9 w-4/5 max-w-40 bg-gray-200" />
                        </div>
                    </div>
                </div>
            ) : error || !book ? (
                <div role="alert" className="rounded-sm bg-[var(--reviewBG)] p-5 text-red-600">
                    {error ?? "No selected book available"}
                </div>
            ) : (
                <Link href={`/book/${encodeURIComponent(book.id)}`} className="group block w-full max-w-[42.5rem] rounded-md focus-visible:outline-2 focus-visible:outline-green-500">
                    <div className="min-w-0 rounded-md bg-[var(--reviewBG)] p-4 sm:p-6 lg:grid lg:min-h-[12rem] lg:grid-cols-[minmax(0,1fr)_1px_8rem_minmax(0,1fr)] lg:items-center lg:gap-4">
                        <p className="mb-5 min-w-0 text-[0.95rem] leading-snug text-[#073249] sm:mb-7 sm:text-[1.05rem] lg:mb-0">
                            {book.subTitle}
                        </p>
                        <div aria-hidden="true" className="hidden h-[8rem] w-px bg-gray-300 lg:block" />
                        <div className="grid min-w-0 grid-cols-[minmax(6.5rem,9rem)_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-7 lg:contents">
                            <div className="relative flex h-[11rem] min-w-0 items-end justify-center sm:h-[13rem] lg:h-[11rem]">
                                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[4.7rem] rounded-t-full bg-[#8ccfe8]" />
                                <Image
                                    src={book.imageLink}
                                    alt={`Cover of ${book.title}`}
                                    width={150}
                                    height={210}
                                    unoptimized
                                    className="relative z-10 h-[10.5rem] w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-[12.5rem] lg:h-[10.5rem]"
                                />
                            </div>
                            <div className="flex min-w-0 flex-col gap-2">
                                <h3 className="break-words text-[clamp(1rem,2.8vw,1.25rem)] font-bold leading-snug text-[#073249]">
                                    {book.title}
                                </h3>
                                <p className="break-words text-[0.95rem] text-gray-600 sm:text-[1rem]">
                                    {book.author}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[0.9rem] font-semibold text-[#073249] sm:text-[1rem]">
                                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black sm:h-12 sm:w-12">
                                        <span className="ml-1 h-0 w-0 border-y-[0.5rem] border-y-transparent border-l-[0.8rem] border-l-white" />
                                    </span>
                                    <span>{duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </section>
    );
}
