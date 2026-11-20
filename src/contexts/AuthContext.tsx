"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GUEST_EMAIL, isGuestAccount } from "@/lib/guestAccount";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isGuest: boolean;
    enterGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Remove the legacy, unauthenticated sessionStorage guest flag.
        sessionStorage.removeItem("summarist-guest");

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    async function enterGuest(): Promise<void> {
        // These are intentionally public DEMO credentials. Anyone using
        // the guest button shares this Firebase Auth identity.
        // Restrict its Firestore permissions and do not attach payments.
        await signInWithEmailAndPassword(auth, GUEST_EMAIL, "test1234");
    }

    const isGuest = user?.isAnonymous === true || isGuestAccount(user);

    return (
        <AuthContext.Provider value={{ user, loading, isGuest, enterGuest }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
