"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Script from "next/script";

interface OwlCarouselProps {
    children: ReactNode;
}

interface OwlInstance {
    owlCarousel: (options: object) => void;
    trigger: (event: string) => void;
}

interface JQueryOwl {
    (element: HTMLElement): OwlInstance;
    fn: {
        owlCarousel?: unknown;
    };
}

export default function OwlCarousel({ children }: OwlCarouselProps) {

    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = carouselRef.current;

        if (!element) return;

        let cancelled = false;
        let retryTimer: ReturnType<typeof setTimeout> | undefined;
        let attempts = 0;

        function initializeCarousel() {
            if (cancelled || !element) return;

            const jQuery = (
                window as Window & { jQuery?: JQueryOwl }
            ).jQuery;

            // Wait until jQuery and Owl Carousel are available
            if (
                !jQuery ||
                typeof jQuery.fn.owlCarousel !== "function"
            ) {
                if (attempts++ < 100) {
                    retryTimer = setTimeout(initializeCarousel, 100);
                } else {
                    console.error("Owl Carousel dependencies failed to load");
                }

                return;
            }

            // Prevent duplicate initialization
            if (element.classList.contains("owl-loaded")) {
                return;
            }

            console.log("Initializing carousel:", element);

            jQuery(element).owlCarousel({
                loop: true,
                margin: 20,
                nav: true,
                dots: false,
                autoWidth: true,

                mouseDrag: true,
                touchDrag: true,

                autoplay: true,
                autoplayTimeout: 2500,
                autoplayHoverPause: true,
                autoplaySpeed: 800,

                smartSpeed: 800,
                responsive: { 0: { margin: 12, nav: false }, 640: { margin: 20, nav: true }, 1024: { margin: 32, nav: true } }
            });

            console.log(
                "Carousel initialized:",
                element.classList.contains("owl-loaded")
            );
        }

        initializeCarousel();

        return () => {
            cancelled = true;

            if (retryTimer) {
                clearTimeout(retryTimer);
            }

            const jQuery = (
                window as Window & { jQuery?: JQueryOwl }
            ).jQuery;

            if (jQuery && element.classList.contains("owl-loaded")) {
                jQuery(element).trigger("destroy.owl.carousel");
            }
        };

    }, []);

    return (
        <>
            <div
                ref={carouselRef}
                className="owl-carousel owl-theme"
            >
                {children}
            </div>
        </>
    );
}