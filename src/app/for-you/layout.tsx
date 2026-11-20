import { Suspense } from "react";
import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";
import "../styles/owl.carousel.min.css";
import "../styles/owl.theme.default.min.css";

export default function ForYouLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" aria-label="Loading page" />}>
            <DashboardShell>{children}</DashboardShell>
        </Suspense>
    );
}
