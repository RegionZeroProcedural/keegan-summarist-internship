"use client";

import { useState } from "react";
import Script from "next/script";

export default function CarouselScripts() {
    const [jqueryLoaded, setJqueryLoaded] = useState(false);

    return (
        <>
            <Script
                src="/vendor/jquery.min.js"
                strategy="afterInteractive"
                onReady={() => {
                    setJqueryLoaded(true);
                }}
            />

            {jqueryLoaded && (
                <Script
                    src="/vendor/owl/owl.carousel.min.js"
                    strategy="afterInteractive"
                />
            )}
        </>
    );
}