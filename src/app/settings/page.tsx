"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

export default function SettingsPage() {
    const { user, loading: authLoading, isGuest } = useAuth();
    const {
        isSubscribed,
        subscription,
        loading: subscriptionLoading,
        error: subscriptionError,
    } = useSubscription();
    const [loginOpen, setLoginOpen] = useState(false);

    const loading = authLoading || subscriptionLoading;
    const needsLogin = !user || isGuest;

    return (
        <section className="w-full text-[#073249]">
            <h1 className="border-b border-gray-200 pb-5 text-[clamp(1.65rem,5vw,2rem)] font-bold leading-tight">
                Settings
            </h1>

            {loading ? (
                <div role="status" aria-label="Loading account settings" className="pt-9">
                    <div className="skeleton h-5 w-52 rounded-md bg-gray-200" />
                    <div className="skeleton mt-3 h-4 w-28 rounded-md bg-gray-200" />
                    <div className="my-8 h-px w-full bg-gray-200" />
                    <div className="skeleton h-5 w-20 rounded-md bg-gray-200" />
                    <div className="skeleton mt-3 h-4 w-44 rounded-md bg-gray-200" />
                </div>
            ) : needsLogin ? (
                <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center px-1 pt-5 text-center sm:pt-10">
                    <Image
                        src="/assets/logo.png"
                        alt="Account login illustration"
                        width={360}
                        height={260}
                        unoptimized
                        className="mb-4 h-auto w-full max-w-[13rem] object-contain sm:mb-6 sm:max-w-[18rem]"
                    />
                    <h2 className="text-[clamp(1.1rem,3.7vw,1.35rem)] font-bold leading-snug">Log in to your account to see your details.</h2>
                    <button
                        type="button"
                        onClick={() => setLoginOpen(true)}
                        className="mt-5 min-h-11 w-full max-w-[12rem] rounded-md bg-[#28e486] px-12 font-semibold text-[#073249] transition-colors hover:bg-[#20cc76] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073249]"
                    >
                        Log in
                    </button>
                </div>
            ) : (
                <>
                    <div className="border-b border-gray-200 py-8">
                        <h2 className="text-[1.125rem] font-bold leading-6">
                            Your Subscription plan
                        </h2>

                        {subscriptionError ? (
                            <p role="alert" className="mt-2 text-sm text-red-600">
                                Unable to load your subscription. Please refresh and try again.
                            </p>
                        ) : (
                            <>
                                <p className="mt-2 text-base leading-6">
                                    {isSubscribed ? "premium-plus" : "basic"}
                                </p>

                                {!isSubscribed && (
                                    <Link
                                        href="/choose-plan"
                                        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-[#28e486] px-6 font-semibold transition-colors hover:bg-[#20cc76] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073249]"
                                    >
                                        Upgrade to Premium
                                    </Link>
                                )}

                                {isSubscribed && subscription?.status === "trialing" && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Free trial · {subscription.plan === "yearly" ? "Yearly" : "Monthly"} plan
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="py-8">
                        <h2 className="text-[1.125rem] font-bold leading-6">Email</h2>
                        <p className="mt-2 break-all text-base leading-6">
                            {user.email || "No email address on file"}
                        </p>
                    </div>
                </>
            )}

            {needsLogin && loginOpen && (
                <LoginModal
                    isOpen
                    onClose={() => setLoginOpen(false)}
                />
            )}
        </section>
    );
}
