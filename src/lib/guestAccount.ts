import type { User } from "firebase/auth";

/** Public demo account: this is NOT a privileged or private account. */
export const GUEST_EMAIL = "test1234@example.com";

export function isGuestAccount(user: Pick<User, "email"> | null | undefined): boolean {
    return user?.email?.trim().toLowerCase() === GUEST_EMAIL;
}
