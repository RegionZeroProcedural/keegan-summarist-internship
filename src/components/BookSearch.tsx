"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

interface SearchBook {
    id: string;
    title: string;
    author: string;
    imageLink?: string;
    subscriptionRequired?: boolean;
}

const SEARCH_API =
    "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle";

export default function BookSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listId = useId();
    const router = useRouter();

    useEffect(() => {
        const value = query.trim();
        if (!value || !open) return;
        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            try {
                const response = await fetch(
                    `${SEARCH_API}?search=${encodeURIComponent(value)}`,
                    { signal: controller.signal },
                );
                if (!response.ok) throw new Error("Search is temporarily unavailable.");
                const data: unknown = await response.json();
                const list: unknown = Array.isArray(data)
                    ? data
                    : data && typeof data === "object" && "books" in data
                        ? data.books
                        : [];
                if (!Array.isArray(list)) throw new Error("Unexpected search response.");
                if (!controller.signal.aborted) {
                    setResults(list.filter((item): item is SearchBook =>
                        item && typeof item === "object" &&
                        typeof item.id === "string" && typeof item.title === "string"
                    ));
                    setError(null);
                }
            } catch (reason) {
                if (!controller.signal.aborted) {
                    setResults([]);
                    setError(reason instanceof Error ? reason.message : "Search failed.");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 300);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [query, open]);

    useEffect(() => {
        function dismiss(event: PointerEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("pointerdown", dismiss);
        return () => document.removeEventListener("pointerdown", dismiss);
    }, []);

    function changeQuery(value: string) {
        setQuery(value);
        setResults([]);
        setActiveIndex(-1);
        setError(null);
        setLoading(Boolean(value.trim()));
        setOpen(true);
    }

    function goTo(book: SearchBook) {
        setOpen(false);
        inputRef.current?.blur();
        router.push(`/book/${encodeURIComponent(book.id)}`);
    }

    return (
        <div ref={containerRef} className="relative ml-auto w-full max-w-[22rem]">
            <div className="flex h-[2.6rem] w-full items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-[#28e486] focus-within:ring-1 focus-within:ring-[#28e486]">
                <input
                    ref={inputRef}
                    type="search"
                    role="combobox"
                    aria-label="Search for books by title or author"
                    aria-autocomplete="list"
                    aria-expanded={open && Boolean(query.trim())}
                    aria-controls={listId}
                    aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
                    value={query}
                    onChange={(event) => changeQuery(event.target.value)}
                    onFocus={() => {
                        if (query.trim()) setOpen(true);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            setOpen(false);
                            return;
                        }
                        if (event.key === "ArrowDown" && results.length) {
                            event.preventDefault();
                            setActiveIndex((current) => Math.min(current + 1, results.length - 1));
                        }
                        if (event.key === "ArrowUp" && results.length) {
                            event.preventDefault();
                            setActiveIndex((current) => Math.max(current - 1, 0));
                        }
                        if (event.key === "Enter" && results.length) {
                            event.preventDefault();
                            goTo(results[Math.max(0, activeIndex)]);
                        }
                    }}
                    placeholder="Search for books"
                    className="h-full min-w-0 flex-1 bg-[var(--statsCard)] px-4 text-sm outline-none"
                />
                <button
                    type="button"
                    aria-label="Show book search results"
                    onClick={() => {
                        inputRef.current?.focus();
                        setOpen(true);
                    }}
                    className="flex h-full w-[2.7rem] shrink-0 items-center justify-center border-l border-gray-300 bg-[var(--statsCard)] hover:bg-gray-50"
                >
                    <HiOutlineMagnifyingGlass className="text-xl" />
                </button>
            </div>

            {open && Boolean(query.trim()) && (
                <div
                    id={listId}
                    role="listbox"
                    aria-label="Book search results"
                    className="absolute right-0 top-[calc(100%+0.45rem)] z-[80] max-h-[24rem] w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-2 shadow-xl"
                >
                    {loading ? (
                        <p role="status" className="px-4 py-3 text-sm text-gray-500">Searching books...</p>
                    ) : error ? (
                        <p role="alert" className="px-4 py-3 text-sm text-red-600">{error}</p>
                    ) : results.length === 0 ? (
                        <p role="status" className="px-4 py-3 text-sm text-gray-500">No matching books found.</p>
                    ) : (
                        results.slice(0, 15).map((book, index) => (
                            <Link
                                id={`${listId}-${index}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                href={`/book/${encodeURIComponent(book.id)}`}
                                onClick={() => setOpen(false)}
                                key={book.id}
                                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                                    index === activeIndex ? "bg-green-50" : "hover:bg-gray-100"
                                }`}
                            >
                                {book.imageLink ? (
                                    <Image
                                        src={book.imageLink}
                                        alt=""
                                        width={40}
                                        height={56}
                                        unoptimized
                                        className="h-14 w-10 shrink-0 rounded-sm object-cover"
                                    />
                                ) : (
                                    <span className="h-14 w-10 shrink-0 rounded-sm bg-gray-200" />
                                )}
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-semibold text-[#073249]">{book.title}</span>
                                    <span className="block truncate text-xs text-gray-500">{book.author}</span>
                                </span>
                                {book.subscriptionRequired && (
                                    <span className="rounded bg-[#e2f9ea] px-1.5 py-1 text-[0.65rem] font-bold text-[#0a7741]">Premium</span>
                                )}
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
