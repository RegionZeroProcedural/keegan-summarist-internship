"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

export default function HandleLogoutBtn() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Failed to log out:", error);
            setIsLoggingOut(false);
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex h-[3.5rem] w-full cursor-pointer items-center gap-3 px-6 text-left hover:bg-gray-100 disabled:opacity-50"
        >
            <HiOutlineArrowRightOnRectangle className="text-[1.5rem]" />

            {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
    );
}