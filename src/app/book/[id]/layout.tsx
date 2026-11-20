import { Suspense } from "react";
import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";

export default function BookLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" aria-label="Loading page" />}>
            <DashboardShell wide>{children}</DashboardShell>
        </Suspense>
    );
}
