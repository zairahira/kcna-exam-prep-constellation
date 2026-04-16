import type { Metadata } from "next";
import { TimerProvider } from "@/lib/timer-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "KCNA Exam Prep",
  description:
    "Comprehensive KCNA preparation - 12 modules covering all 5 exam domains with debug challenges, reviews, and quizzes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark-palette">
      <body>
        <TimerProvider>
          {children}
        </TimerProvider>
      </body>
    </html>
  );
}
