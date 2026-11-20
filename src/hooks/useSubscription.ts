"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface Subscription {
    status: string;
    plan: string;
}

export function useSubscription() {
    const { user, loading: authLoading } = useAuth();

    const [subscription, setSubscription] =
        useState<Subscription | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // The demo account is a REAL Firebase email/password user. Its subscription
    // must be read by UID just like every other authenticated account.
    // Anonymous auth does not qualify for a subscription.
    const uid = user && !user.isAnonymous ? user.uid : null;

    useEffect(() => {
        if (authLoading) return;

        if (!uid) {
            setSubscription(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setSubscription(null);
        setError(null);

        const subscriptionRef = doc(
            db,
            "subscriptions",
            uid
        );

        const unsubscribe = onSnapshot(
            subscriptionRef,
            (snapshot) => {
                const data = snapshot.data();

                setSubscription(
                    data
                        ? {
                            status: String(data.status ?? "inactive"),
                            plan: String(data.plan ?? "none"),
                        }
                        : null
                );

                setLoading(false);
            },
            (error) => {
                console.error("Subscription error:", error);
                setError(error.message);
                setSubscription(null);
                setLoading(false);
            }
        );

        return () => unsubscribe();

    }, [uid, authLoading]);

    const isSubscribed = Boolean(uid) && (
        subscription?.status === "active" ||
        subscription?.status === "trialing"
    );

    return {
        subscription,
        isSubscribed,
        loading: authLoading || loading,
        error,
    };
}