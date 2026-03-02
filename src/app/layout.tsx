import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/Toast";

export const metadata: Metadata = {
  title: "TutorApp - NDPI",
  description: "NDPI Tutor boshqaruv tizimi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="max-w-[480px] mx-auto min-h-screen bg-[#F5F6FA] relative shadow-xl">
          <ToastProvider />
          {children}
        </div>
      </body>
    </html>
  );
}
