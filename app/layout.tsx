import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { TimerProvider } from "./providers/TImerProvider ";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "禁煙ポモドーロ",
  description: "ポモドーロテクニックを使って禁煙をサポートするアプリ",
  manifest: "/manifest.json",
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#0d0d0f', color: '#f5f5f5', minHeight: '100dvh' }}>
          <TimerProvider>
            <div className="pb-20">
              {children}
            </div>
            <Navbar />
          </TimerProvider>

           <script dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.log('Service Worker registration failed', err))
              });
            }
            `
           }} />
      </body>
    </html>
  );
}
