import { Suspense } from "react";
import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";

export default function PlayerLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" aria-label="Loading page" />}>
            <DashboardShell player>{children}</DashboardShell>
        </Suspense>
    );
}
