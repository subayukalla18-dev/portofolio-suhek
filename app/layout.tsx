import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Subayu Kalla — Full Stack Developer",
    template: "%s | Subayu Kalla",
  },

  description:
    "Portfolio pribadi Subayu Kalla — Informatics student and Full Stack Developer based in Lampung, Indonesia.",

  keywords: [
    "Subayu Kalla",
    "Full Stack Developer",
    "Web Developer",
    "Informatics Student",
    "Portfolio",
    "Lampung",
    "Indonesia",
  ],

  authors: [{ name: "Subayu Kalla" }],
  creator: "Subayu Kalla",

  openGraph: {
    title: "Subayu Kalla — Full Stack Developer",
    description:
      "Portfolio pribadi Subayu Kalla — Informatics student and Full Stack Developer based in Lampung, Indonesia.",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Subayu Kalla — Full Stack Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Subayu Kalla — Full Stack Developer",
    description:
      "Portfolio pribadi Subayu Kalla — Informatics student and Full Stack Developer based in Lampung, Indonesia.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}