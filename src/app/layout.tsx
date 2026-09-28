import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  src: [
    { path: "./fonts/Geist-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Geist-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-geist",
  display: "swap",
  fallback: ["Arial"],
});

export const metadata: Metadata = {
  title: "Renn — Join the Waitlist",
  description:
    "Leave your email address, and we will contact you as soon as Renn Finance will be in Beta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
