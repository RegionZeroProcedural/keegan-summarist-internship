"use client";

import { useEffect, useState } from "react";

// Labels reflect the actual CSS pixel size used for the book summary.
// The legacy rem values are recognized so existing preferences keep working.
const FONT_SIZES = [
    { label: "Small", pixels: 16, legacy: "1rem" },
    { label: "Medium", pixels: 18, legacy: "1.125rem" },
    { label: "Large", pixels: 20, legacy: "1.25rem" },
    { label: "Extra large", pixels: 24, legacy: "1.5rem" },
] as const;

const STORAGE_KEY = "reader-font-size";

export default function FontSizeSwitcher() {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        const found = FONT_SIZES.findIndex(
            (font) => stored === `${font.pixels}px` || stored === font.legacy,
        );
        const index = found >= 0 ? found : 0;
        const size = `${FONT_SIZES[index].pixels}px`;
        setSelected(index);
        document.documentElement.style.setProperty("--reader-font-size", size);
    }, []);

    function changeFontSize(index: number) {
        const font = FONT_SIZES[index];
        const size = `${font.pixels}px`;
        setSelected(index);
        document.documentElement.style.setProperty("--reader-font-size", size);
        window.localStorage.setItem(STORAGE_KEY, size);
    }

    return (
        <div className="w-full min-w-0">
            <p className="mb-2 text-[0.8125rem] font-semibold text-[#073249]/80">
                Reading font size
            </p>
            <div role="group" aria-label="Reading font size" className="grid w-full max-w-[17.5rem] grid-cols-4 gap-1">
                {FONT_SIZES.map((font, index) => (
                    <button
                        key={font.pixels}
                        type="button"
                        onClick={() => changeFontSize(index)}
                        aria-label={`${font.label}: ${font.pixels} pixels`}
                        aria-pressed={selected === index}
                        title={`${font.label} (${font.pixels}px)`}
                        className={`flex min-h-[4rem] min-w-0 cursor-pointer flex-col items-center justify-end gap-1 rounded-md border border-transparent px-1 pb-2 pt-1 transition-[background-color,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${
                            selected === index
                                ? "border-[#28e486] bg-[#e7fbf0] text-[#073249]"
                                : "text-[#073249]/70 hover:bg-gray-100"
                        }`}
                    >
                        <span
                            aria-hidden="true"
                            className="font-semibold leading-none"
                            style={{ fontSize: `${font.pixels}px` }}
                        >
                            Aa
                        </span>
                        <span className="whitespace-nowrap text-[0.6875rem] font-medium leading-none tabular-nums">
                            {font.pixels}px
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
