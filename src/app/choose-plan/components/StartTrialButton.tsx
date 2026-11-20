"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface StartTrialButtonProps {
    plan: "yearly" | "monthly";
}

export default function StartTrialButton({
    plan,
}: StartTrialButtonProps) {
    const { user, isGuest } = useAuth();

    const [loadingAnimation, setLoadingAnimation] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function startCheckout() {
        if (loadingAnimation) return;

        if (!user || isGuest) {
            setError("Please log into a registered account.");
            return;
        }

        setLoadingAnimation(true);
        setError(null);

        try {
            const token = await user.getIdToken();

            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    plan,
                }),
            });

            const result = await response.json();

            console.log("Checkout HTTP status:", response.status);

            if (!response.ok) {
                throw new Error(
                    result.error || "Unable to create checkout session."
                );
            }

            if (!result.url) {
                throw new Error("Stripe Checkout URL was not returned.");
            }

            // Redirect to Stripe's hosted Checkout page
            window.location.assign(result.url);

        } catch (err) {
            console.error("Stripe Checkout error:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );

            setLoadingAnimation(false);
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-[22rem] flex-col items-center">

            <button
                type="button"
                onClick={startCheckout}
                disabled={loadingAnimation}
                className="
                    flex
                    min-h-11
                    w-full
                    max-w-[20rem]
                    items-center
                    justify-center
                    rounded-md
                    bg-green-400
                    px-4
                    text-center
                    text-[0.95rem]
                    font-medium
                    sm:text-base
                    text-gray-800
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:bg-green-300
                    hover:shadow-[0_0_20px_rgba(74,222,128,0.35)]
                    disabled:opacity-60
                    disabled:cursor-wait
                "
            >
                {loadingAnimation ? (
                    <span className="flex items-center gap-3">
                        <span
                            aria-hidden="true"
                            className="
                                h-5
                                w-5
                                animate-spin
                                rounded-full
                                border-2
                                border-gray-800
                                border-t-transparent
                            "
                        />
                        Redirecting...
                    </span>
                ) : plan === "yearly" ? (
                    "Start your free 7-day trial"
                ) : (
                    "Start your first month"
                )}
            </button>

            <p className="mt-3 text-center text-xs leading-relaxed text-gray-500 sm:text-[0.8rem]">
                {plan === "yearly"
                    ? "Cancel your trial at any time before it ends, and you won't be charged."
                    : "30-day money back guarantee, no questions asked."}
            </p>

            {error && (
                <p
                    role="alert"
                    className="mt-4 text-center text-sm text-red-500"
                >
                    {error}
                </p>
            )}

        </div>
    );
}