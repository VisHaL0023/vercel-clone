/** @format */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Vercel Clone",
    description: "Deploy your app in few minutes",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "bg-white text-black dark:bg-black dark:text-white",
                    inter.className
                )}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
