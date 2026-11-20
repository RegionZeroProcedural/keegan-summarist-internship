import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";

export default function BookLayout({ children }: { children: ReactNode }) {
    return <DashboardShell wide>{children}</DashboardShell>;
}
