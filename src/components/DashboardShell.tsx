"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "/public/assets/pricing-top.png";
import { useAuth } from "@/contexts/AuthContext";
import HandleLogoutBtn from "@/components/HandleLogoutBtn";
import LoginModal from "@/components/LoginModal";
import BookSearch from "@/components/BookSearch";
import FontSizeSwitcher from "@/app/player/[id]/FontSizeSwitcher";
import {
    HiOutlineHome,
    HiOutlineBookmark,
    HiOutlinePencilSquare,
    HiOutlineMagnifyingGlass,
    HiOutlineCog6Tooth,
    HiOutlineQuestionMarkCircle,
    HiOutlineArrowRightOnRectangle,
    HiOutlineBars3,
    HiOutlineXMark,
} from "react-icons/hi2";

type Section = "for-you" | "library" | "settings";

export default function DashboardShell({
    children,
    wide = false,
    player = false,
}: {
    children: ReactNode;
    wide?: boolean;
    player?: boolean;
}) {
    const pathname = usePathname();
    const active: Section = pathname.startsWith("/for-you/library")
        ? "library"
        : pathname.startsWith("/settings")
            ? "settings"
            : "for-you";
    const { user, loading } = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const mobilePanelRef = useRef<HTMLElement>(null);

    // All dashboard routes share the same drawer, and a navigation closes it.
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)");
        const onResize = () => {
            if (media.matches) setMenuOpen(false);
        };
        media.addEventListener("change", onResize);
        return () => media.removeEventListener("change", onResize);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
            }
            if (event.key !== "Tab" || !mobilePanelRef.current) return;
            const focusables = Array.from(mobilePanelRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
            )).filter((element) => element.getClientRects().length > 0);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = original;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen]);

    const navClass = (selected: boolean) =>
        `flex min-h-14 items-center gap-3 text-[1rem] sm:min-h-[4.25rem] sm:text-[1.125rem] lg:min-h-14 lg:text-[1rem] transition-colors ${
            selected
                ? "border-l-4 border-[#28e486] bg-gray-100 px-5 font-semibold"
                : "border-l-4 border-transparent px-5 hover:bg-gray-100"
        }`;
    const disabledClass =
        "flex min-h-14 sm:min-h-[4.25rem] lg:min-h-14 cursor-not-allowed select-none items-center gap-3 border-l-4 border-transparent px-5 text-[1rem] sm:text-[1.125rem] lg:text-[1rem] text-[#073249]/35";

    const closeMenu = () => setMenuOpen(false);
    const openLogin = () => {
        closeMenu();
        setLoginOpen(true);
    };

    // A shared navigation tree ensures desktop and mobile have identical links,
    // disabled items, login/logout behavior, and player font controls.
    function navigation() {
        return (
            <>
                <nav aria-label="Primary navigation" className="mt-4 flex flex-col gap-1 sm:mt-7 sm:gap-1.5 lg:mt-4 lg:gap-1">
                    <Link href="/for-you" onClick={closeMenu} aria-current={active === "for-you" ? "page" : undefined} className={navClass(active === "for-you")}>
                        <HiOutlineHome aria-hidden="true" className="shrink-0 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.5rem]" /> For you
                    </Link>
                    <Link href="/for-you/library" onClick={closeMenu} aria-current={active === "library" ? "page" : undefined} className={navClass(active === "library")}>
                        <HiOutlineBookmark aria-hidden="true" className="shrink-0 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.5rem]" /> My Library
                    </Link>
                    <span aria-disabled="true" title="Coming soon" className={disabledClass}>
                        <HiOutlinePencilSquare aria-hidden="true" className="shrink-0 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.5rem]" /> Highlights
                    </span>
                    <span aria-disabled="true" title="Use the search bar above" className={disabledClass}>
                        <HiOutlineMagnifyingGlass aria-hidden="true" className="shrink-0 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.5rem]" /> Search
                    </span>
                    {player && <div className="mt-4 px-5"><FontSizeSwitcher /></div>}
                </nav>
                <nav aria-label="Account navigation" className="mt-auto flex flex-col gap-1 pb-5 pt-8 sm:pb-7 sm:gap-1.5 lg:gap-1">
                    <Link href="/settings" onClick={closeMenu} aria-current={active === "settings" ? "page" : undefined} className={navClass(active === "settings")}>
                        <HiOutlineCog6Tooth aria-hidden="true" className="shrink-0 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.5rem]" /> Settings
                    </Link>
                    <span aria-disabled="true" title="Coming soon" className={disabledClass}>
                        <HiOutlineQuestionMarkCircle aria-hidden="true" className="shrink-0 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.5rem]" /> Help &amp; Support
                    </span>
                    {loading ? (
                        <span className="px-6 py-3 text-sm text-gray-500">Loading account...</span>
                    ) : user ? (
                        <div onClick={closeMenu}><HandleLogoutBtn /></div>
                    ) : (
                        <button type="button" onClick={openLogin} className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-6 text-left text-[1rem] hover:bg-gray-100 sm:min-h-[4.25rem] sm:text-[1.125rem] lg:min-h-14 lg:text-[1rem]">
                            <HiOutlineArrowRightOnRectangle aria-hidden="true" className="shrink-0 text-[1.5rem] sm:text-[1.75rem] lg:text-[1.5rem]" /> Login
                        </button>
                    )}
                </nav>
            </>
        );
    }

    return (
        <div className="min-h-screen min-w-0 w-full bg-white text-[#073249]">
            {/* Desktop navigation stays fixed and retains its original dimensions. */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[15rem] flex-col overflow-y-auto border-r border-gray-100 bg-[#f8fafb] lg:flex">
                <div className="flex h-[5.25rem] shrink-0 items-center px-5">
                    <Link href="/for-you" aria-label="Summarist home"><Image src={Logo} alt="Summarist" className="h-auto w-[11.5rem]" priority /></Link>
                </div>
                {navigation()}
            </aside>

            {/* The mobile drawer slides over the content instead of squeezing it. */}
            <div className={`fixed inset-0 z-[100] lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                <button
                    type="button"
                    tabIndex={menuOpen ? 0 : -1}
                    aria-label="Close navigation menu"
                    onClick={closeMenu}
                    className={`absolute inset-0 w-full bg-black/50 transition-opacity duration-300 motion-reduce:transition-none ${menuOpen ? "opacity-100" : "opacity-0"}`}
                />
                <aside
                    ref={mobilePanelRef}
                    id="summarist-mobile-menu"
                    role="dialog"
                    aria-modal={menuOpen ? "true" : undefined}
                    aria-label="Navigation menu"
                    aria-hidden={!menuOpen}
                    inert={!menuOpen}
                    className={`absolute inset-y-0 left-0 flex h-full w-[min(20rem,86vw)] flex-col overflow-y-auto overscroll-contain bg-[#f8fafb] shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none sm:w-[min(37.5rem,80vw)] ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="relative flex h-[5.75rem] shrink-0 items-center justify-center px-12 sm:h-[7rem]">
                        <Link href="/for-you" onClick={closeMenu} aria-label="Summarist home" className="min-w-0">
                            <Image src={Logo} alt="Summarist" className="h-auto w-[10.5rem] max-w-full sm:w-[15rem]" priority />
                        </Link>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={closeMenu}
                            aria-label="Close navigation"
                            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-[#073249]/75 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-green-500 sm:right-4"
                        >
                            <HiOutlineXMark aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    {navigation()}
                </aside>
            </div>

            <div className="min-w-0 lg:ml-[15rem]">
                <header className="relative z-20 flex min-h-[4.75rem] items-center border-b border-gray-200 bg-white px-3 sm:min-h-[5.25rem] sm:px-6 lg:px-9">
                    <div className="mx-auto flex w-full max-w-[70rem] min-w-0 items-center justify-end gap-2 sm:gap-4">
                        <div className="w-full min-w-0 max-w-[28rem] lg:max-w-[22rem]"><BookSearch /></div>
                        <button
                            ref={menuButtonRef}
                            type="button"
                            aria-label="Open navigation menu"
                            aria-controls="summarist-mobile-menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(true)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-green-500 lg:hidden"
                        >
                            <HiOutlineBars3 aria-hidden="true" className="h-8 w-8" />
                        </button>
                    </div>
                </header>
                <main className={`mx-auto min-w-0 w-full px-4 pb-24 pt-6 sm:px-8 sm:pt-9 lg:px-9 lg:pb-20 lg:pt-10 ${player ? "pb-[13rem] sm:pb-[13rem] lg:pb-[8rem]" : ""} ${wide ? "max-w-[90rem]" : "max-w-[70rem]"}`}>
                    {children}
                </main>
            </div>
            {loginOpen && <LoginModal isOpen onClose={() => setLoginOpen(false)} />}
        </div>
    );
}
