import type { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";
import "../styles/owl.carousel.min.css";
import "../styles/owl.theme.default.min.css";

export default function ForYouLayout({ children }: { children: ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}
