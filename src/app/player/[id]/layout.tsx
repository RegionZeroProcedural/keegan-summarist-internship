import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";

export default function PlayerLayout({ children }: { children: ReactNode }) {
    return <DashboardShell player>{children}</DashboardShell>;
}
