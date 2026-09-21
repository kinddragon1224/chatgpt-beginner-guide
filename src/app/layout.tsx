import type { Metadata } from "next";
import { Noto_Sans_KR, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "왕초보를 위한 ChatGPT 사용 설명서",
    template: "%s · 왕초보 ChatGPT",
  },
  description:
    "더루멘 김선용 대표 with 그록봇 — ChatGPT를 오늘 바로 쓰는 읽기+연습 미니 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${noto.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-6 pb-16">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-slate-500">
            더루멘 김선용 대표 with 그록봇 · 진행 상태는 이 브라우저에만
            저장됩니다
          </div>
        </footer>
      </body>
    </html>
  );
}
