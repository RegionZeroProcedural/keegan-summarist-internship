import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles/owl.carousel.min.css";
import "./styles/owl.theme.default.min.css";
import { AuthProvider } from "@/contexts/AuthContext";
import CarouselScripts from "@/components/CarouselScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Summarist",
  description: "Keegan Internship Project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {

  return (
    <html lang="en">
        <body className="min-h-screen flex flex-col">

            <CarouselScripts />
            <AuthProvider>
              {children}
            </AuthProvider>

        </body>
    </html>
  );
}
