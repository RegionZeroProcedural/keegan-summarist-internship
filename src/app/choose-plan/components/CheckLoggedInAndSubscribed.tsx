"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

export default function CheckLoggedInAndSubscribed() {
    const router = useRouter();

    const {
        user,
        loading: authLoading,
    } = useAuth();

    const {
        isSubscribed,
        loading: subscriptionLoading,
    } = useSubscription();

    const loading = authLoading || subscriptionLoading;

    const shouldRedirect =
        !loading &&
        user !== null &&
        isSubscribed;

    useEffect(() => {
        if (!shouldRedirect) return;

        const timeout = setTimeout(() => {
            router.replace("/for-you");
        }, 1500);

        return () => clearTimeout(timeout);
    }, [shouldRedirect, router]);

    if (!shouldRedirect) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                backdrop-blur-sm
            "
        >
            <div
                role="status"
                className="
                    flex
                    w-[25rem]
                    max-w-[calc(100%-2rem)]
                    flex-col
                    items-center
                    justify-center
                    gap-5
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    p-8
                    shadow-xl
                "
            >
                <span
                    aria-hidden="true"
                    className="
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-green-400
                        border-t-transparent
                    "
                />

                <h2 className="text-center text-xl font-bold text-gray-800">
                    Subscription confirmed!
                </h2>

                <p className="text-center text-gray-500">
                    Your premium access is ready.
                    Redirecting to your library...
                </p>
            </div>
        </div>
    );
}