"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function UseAuth() {
    const { user, loading } = useAuth();
    return (
        <>
            <div className="self-center">
                {loading
                    ? "Checking authentication..."
                    : user
                        ? `${user.email}`
                        : "Not logged in"}
            </div>
        </>
    )
}