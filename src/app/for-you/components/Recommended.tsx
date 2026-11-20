"use client";

import Book from './Book';
import { useState, useEffect } from 'react';
import axios from 'axios';
import OwlCarousel from "./OwlCarousel";
import Link from "next/link";
import { getAudioDuration, formatAudioDuration } from "@/lib/audioDuration";

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

export default function Recommended() {

    const [doneLoading, setDoneLoading] = useState(false);
    
    const [books, setBooks] = useState<BookData[]>([]);
    
    const [error, setError] = useState<string | null>(null);

    const [durations, setDurations] = useState<Record<string, string>>({});

    useEffect(() => {
        const controller = new AbortController();

        async function getBooks() {
            console.log("Starting recommended books request...");

            try {
                const response = await axios.get<BookData[]>(
                    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
                    { signal: controller.signal }
                );

                console.log("API RESPONSE:", response.data);

                const recommendedBooks = response.data;

                if (!Array.isArray(recommendedBooks)) {
                    throw new Error("Invalid recommended books response");
                }

                if (!controller.signal.aborted) {
                    setBooks(recommendedBooks);
                    setError(null);
                }

            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("BOOK FETCH ERROR:", error);

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load books"
                    );
                }

            } finally {
                if (!controller.signal.aborted) {
                    setDoneLoading(true);
                }
            }
        }

        void getBooks();

        return () => controller.abort();

    }, []);

    useEffect(() => {
        if (!books || books.length === 0) return;

        let cancelled = false;

        async function loadDurations() {
            const results = await Promise.all(
                books!.map(async (book) => {
                    try {
                        const seconds = await getAudioDuration(book.audioLink);
                        const formatted = formatAudioDuration(seconds);

                        return [book.id, formatted] as const;

                    } catch (error) {
                        console.error(`Failed to load duration for ${book.title}`, error);
                        return [book.id, "--:--"] as const;
                    }
                })
            );

            if (!cancelled) {
                setDurations(Object.fromEntries(results));
            }
        }

        void loadDurations();

        return () => {
            cancelled = true;
        };

    }, [books]);

    console.log(books);


    return (
        <>
            <div className="flex flex-col">
                <h1 className="text-[1.3rem] pt-5 pb-3 text-gray-800 font-bold">
                    Recommended For You
                </h1>

                <h2 className="font-extralight text-[1rem] text-gray-500">
                    We think you&apos;ll like these
                </h2>

                <div className="w-full min-w-0">
                    <div className={!doneLoading ? 'flex flex-row gap-4 overflow-hidden sm:gap-6' : 'min-w-0'}>
                    {!doneLoading ? (

                        Array.from({ length: 6 }, (_, index) => (
                            <div key={index} className="pt-10 flex flex-col w-44 shrink-0">

                                <div className="skeleton h-45 w-44" />

                                <div className="skeleton h-5 w-40 mt-3" />

                                <div className="skeleton h-4 w-30 mt-3" />

                                <div className="skeleton h-4 w-44 mt-3" />

                                <div className="skeleton h-4 w-32 mt-2" />

                            </div>
                        ))

                    ) : error ? (

                        <div className="text-red-500 pt-10">
                            {error}
                        </div>

                    ) : books.length === 0 ? (

                        <div className="text-gray-500 pt-10">
                            No recommended books available.
                        </div>

                    ) : (
                        <OwlCarousel>
                            {books.map((book) => (
                                <div key={book.id} className="relative shrink-0 w-44">
                                    <Link
                                        href={`/book/${encodeURIComponent(book.id)}`}
                                        className="block w-44"
                                    >
                                        <Book
                                            image={book.imageLink}
                                            title={book.title}
                                            body={book.subTitle}
                                            author={book.author}
                                            time={durations[book.id] ?? "--:--"}
                                            rating={Number(book.averageRating.toFixed(1))}
                                            subscriptionRequired={book.subscriptionRequired}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </OwlCarousel>

                    )}
                    </div>

                </div>
            </div>
        </>
    );
}