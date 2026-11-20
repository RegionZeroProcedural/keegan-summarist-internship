"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type MouseEvent,
} from "react";
import { FaUserAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiX } from "react-icons/fi";
import { FirebaseError } from "firebase/app";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

type LoginModalProps = {
    onClose: () => void;
    isOpen: boolean;
};

export default function LoginModal({ onClose, isOpen }: LoginModalProps) {
    const closeButtonRef = useRef<HTMLAnchorElement>(null);
    const [message, setMessage] = useState("");
    const [messageIsSuccess, setMessageIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [emailInput, setEmailInput] = useState("");

    const router = useRouter();
    const { enterGuest } = useAuth();

    const closeModal = useCallback(() => {
        setIsRegistering(false);
        setIsResetting(false);
        setResetSent(false);
        setMessage("");
        setMessageIsSuccess(false);
        setEmailInput("");
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") closeModal();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, closeModal]);

    // Keep the existing native #summarist-login fallback working.
    function handleClose(event: MouseEvent<HTMLAnchorElement>) {
        if (window.location.hash !== "#summarist-login") {
            event.preventDefault();
        }
        closeModal();
    }

    async function handleGuest() {
        if (isSubmitting) return;
        setMessage("");
        setMessageIsSuccess(false);
        setIsSubmitting(true);
        try {
            await enterGuest();
            closeModal();
            router.push("/for-you");
        } catch (reason) {
            console.error("Guest login failed:", reason);
            setMessage("Unable to sign in to the demo account. Confirm that the guest account exists in Firebase Authentication and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleGoogleSignIn() {
        if (isSubmitting) return;

        setMessage("");
        setMessageIsSuccess(false);
        setIsSubmitting(true);

        try {
            // Call this directly from the button click so browsers will
            // recognize the Google popup as user-initiated.
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            await signInWithPopup(auth, provider);

            // AuthContext's onAuthStateChanged handles the new Firebase user
            // and clears any previous guest session automatically.
            closeModal();
            router.push("/for-you");
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/popup-closed-by-user":
                    case "auth/cancelled-popup-request":
                        // Closing the account picker is not a login failure.
                        break;
                    case "auth/popup-blocked":
                        setMessage("Your browser blocked the Google sign-in popup. Allow popups for this site and try again.");
                        break;
                    case "auth/operation-not-allowed":
                        setMessage("Google sign-in is not enabled for this app yet.");
                        break;
                    case "auth/unauthorized-domain":
                        setMessage("This website domain is not authorized for Google sign-in. Please contact support.");
                        break;
                    case "auth/account-exists-with-different-credential":
                        setMessage("This email is already associated with another sign-in method. Please use that method to sign in.");
                        break;
                    case "auth/network-request-failed":
                        setMessage("Network error. Check your connection and try again.");
                        break;
                    case "auth/too-many-requests":
                        setMessage("Too many attempts. Please try again later.");
                        break;
                    default:
                        console.error("Google sign-in failed:", error.code);
                        setMessage("Google sign-in failed. Please try again.");
                }
            } else {
                console.error("Google sign-in failed:", error);
                setMessage("Google sign-in failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;

        setMessage("");
        setMessageIsSuccess(false);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        setIsSubmitting(true);
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }

            closeModal();
            router.push("/for-you");
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/invalid-credential":
                    case "auth/wrong-password":
                    case "auth/user-not-found":
                        setMessage("Incorrect email or password.");
                        break;
                    case "auth/too-many-requests":
                        setMessage("Too many attempts. Please try again later.");
                        break;
                    case "auth/invalid-email":
                        setMessage("Please enter a valid email address.");
                        break;
                    case "auth/email-already-in-use":
                        setMessage("An account with this email already exists.");
                        break;
                    case "auth/weak-password":
                        setMessage("Please choose a stronger password.");
                        break;
                    default:
                        setMessage("Login failed. Please try again.");
                }
            } else {
                setMessage("An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting || resetSent) return;

        const email = emailInput.trim();
        if (!email) {
            setMessage("Please enter your email address.");
            return;
        }

        setMessage("");
        setMessageIsSuccess(false);
        setIsSubmitting(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
            setMessageIsSuccess(true);
            // Don't reveal whether this email is registered to an account.
            setMessage("If an account exists with that email, you'll receive a password reset link shortly. Check your spam folder too.");
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case "auth/user-not-found":
                        // Some Firebase projects return this; newer projects with
                        // email enumeration protection do not. Respond identically.
                        setResetSent(true);
                        setMessageIsSuccess(true);
                        setMessage("If an account exists with that email, you'll receive a password reset link shortly. Check your spam folder too.");
                        break;
                    case "auth/invalid-email":
                    case "auth/missing-email":
                        setMessage("Please enter a valid email address.");
                        break;
                    case "auth/too-many-requests":
                        setMessage("Too many requests. Please wait before trying again.");
                        break;
                    case "auth/network-request-failed":
                        setMessage("Network error. Check your connection and try again.");
                        break;
                    default:
                        console.error("Password reset failed:", error.code);
                        setMessage("Unable to send a reset email right now. Please try again.");
                }
            } else {
                console.error("Password reset failed:", error);
                setMessage("Unable to send a reset email right now. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    function showResetForm() {
        setIsResetting(true);
        setResetSent(false);
        setMessage("");
        setMessageIsSuccess(false);
    }

    function switchBottomView() {
        if (isSubmitting) return;
        if (isResetting) {
            setIsResetting(false);
            setIsRegistering(false);
            setResetSent(false);
        } else {
            setIsRegistering((previous) => !previous);
        }
        setMessage("");
        setMessageIsSuccess(false);
    }

    return (
        <div
            id="summarist-login"
            data-open={isOpen ? "true" : "false"}
            className="summarist-login-overlay fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-2 sm:p-4"
        >
            <a
                href="#"
                onClick={handleClose}
                aria-label="Close login dialog"
                className="absolute inset-0 cursor-default"
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="summarist-login-title"
                className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-[26.25rem] overflow-y-auto rounded-[0.25rem] bg-[#e2e2e2] text-[#0b3045] shadow-2xl"
            >
                <a
                    href="#"
                    ref={closeButtonRef}
                    onClick={handleClose}
                    aria-label="Close login modal"
                    className="absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-black transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:right-3 sm:top-3"
                >
                    <FiX aria-hidden="true" className="h-7 w-7" />
                </a>

                <div className="px-4 pt-12 sm:px-8">
                    <h2
                        id="summarist-login-title"
                        className="mb-6 text-center text-[1.25rem] font-bold leading-7"
                    >
                        {isResetting
                            ? "Reset your password"
                            : isRegistering
                                ? "Sign up for Summarist"
                                : "Log in to Summarist"}
                    </h2>

                    {isResetting ? (
                        <>
                            <p className="mb-6 text-center text-[0.875rem] leading-5 text-[#43545a]">
                                Enter your account email and we&apos;ll send you a link to reset your password.
                            </p>
                            {!resetSent && (
                                <form onSubmit={handlePasswordReset} className="mb-[1.25rem] flex flex-col gap-[1.125rem]">
                                    <label className="sr-only" htmlFor="summarist-reset-email">Email Address</label>
                                    <input
                                        id="summarist-reset-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="Email Address"
                                        value={emailInput}
                                        onChange={(event) => setEmailInput(event.target.value)}
                                        required
                                        className="min-h-11 w-full rounded-[0.25rem] border-2 border-[#c5d4da] bg-transparent px-3 text-base text-[#0b3045] placeholder:text-[#8e8e8e] focus:border-[#438df9] focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="min-h-11 w-full cursor-pointer rounded-[0.25rem] bg-[#28e486] text-[1.05rem] font-medium text-[#0b3045] transition-colors hover:bg-[#20cf76] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSubmitting ? "Sending..." : "Send reset link"}
                                    </button>
                                </form>
                            )}
                            {resetSent && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResetSent(false);
                                        setMessage("");
                                        setMessageIsSuccess(false);
                                    }}
                                    className="mx-auto mb-[1.25rem] block cursor-pointer text-[0.875rem] text-[#438df9] hover:underline"
                                >
                                    Try a different email
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {!isRegistering && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleGuest}
                                        disabled={isSubmitting}
                                        className="relative flex h-11 w-full cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#4263ae] px-4 font-semibold text-white transition-colors hover:bg-[#365397]"
                                    >
                                        <FaUserAlt aria-hidden="true" className="absolute left-3 h-6 w-6 text-[#e4e7eb]" />
                                        Login as a Guest
                                    </button>
                                    <div className="my-3.5 flex items-center gap-6 text-[0.95rem] text-[#43545a]" aria-hidden="true">
                                        <span className="h-px flex-1 bg-[#cbd5d9]" />
                                        <span>or</span>
                                        <span className="h-px flex-1 bg-[#cbd5d9]" />
                                    </div>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isSubmitting}
                                aria-busy={isSubmitting}
                                className="relative flex h-11 w-full cursor-pointer items-center justify-center rounded-[0.25rem] bg-[#438df9] px-4 font-semibold text-white transition-colors hover:bg-[#2d7be9] disabled:cursor-wait disabled:opacity-60"
                            >
                                <span className="absolute left-1 flex h-9 w-9 items-center justify-center rounded-[0.2rem] bg-[#e8edeb]">
                                    <FcGoogle aria-hidden="true" className="h-7 w-7" />
                                </span>
                                {isSubmitting ? "Please wait..." : "Continue with Google"}
                            </button>

                            <div className="my-3.5 flex items-center gap-6 text-[0.95rem] text-[#43545a]" aria-hidden="true">
                                <span className="h-px flex-1 bg-[#cbd5d9]" />
                                <span>or</span>
                                <span className="h-px flex-1 bg-[#cbd5d9]" />
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-[1.125rem]">
                                <label className="sr-only" htmlFor="summarist-login-email">Email Address</label>
                                <input
                                    id="summarist-login-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="Email Address"
                                    value={emailInput}
                                    onChange={(event) => setEmailInput(event.target.value)}
                                    required
                                    className="min-h-11 w-full rounded-[0.25rem] border-2 border-[#c5d4da] bg-transparent px-3 text-base text-[#0b3045] placeholder:text-[#8e8e8e] focus:border-[#438df9] focus:outline-none"
                                />
                                <label className="sr-only" htmlFor="summarist-login-password">Password</label>
                                <input
                                    id="summarist-login-password"
                                    type="password"
                                    name="password"
                                    autoComplete={isRegistering ? "new-password" : "current-password"}
                                    placeholder="Password"
                                    required
                                    className="min-h-11 w-full rounded-[0.25rem] border-2 border-[#c5d4da] bg-transparent px-3 text-base text-[#0b3045] placeholder:text-[#8e8e8e] focus:border-[#438df9] focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-h-11 w-full cursor-pointer rounded-[0.25rem] bg-[#28e486] text-[1.05rem] font-medium text-[#0b3045] transition-colors hover:bg-[#20cf76] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Please wait..." : isRegistering ? "Sign Up" : "Login"}
                                </button>
                            </form>

                            {!isRegistering && (
                                <button
                                    type="button"
                                    onClick={showResetForm}
                                    className="mx-auto mt-[1.375rem] mb-[1.25rem] block cursor-pointer text-[0.875rem] text-[#438df9] hover:underline"
                                >
                                    Forgot your password?
                                </button>
                            )}
                        </>
                    )}

                    {message && (
                        <p
                            role={messageIsSuccess ? "status" : "alert"}
                            className={`mb-4 text-center text-sm ${messageIsSuccess ? "text-[#43545a]" : "text-red-600"}`}
                        >
                            {message}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={switchBottomView}
                    disabled={isSubmitting}
                    className="flex min-h-11 w-full cursor-pointer items-center justify-center bg-[#d9dfdf] px-4 py-2 text-[0.95rem] text-[#438df9] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isResetting
                        ? "Back to login"
                        : isRegistering
                            ? "Already have an account? Log in"
                            : "Don't have an account? Sign up"}
                </button>
            </section>
        </div>
    );
}
