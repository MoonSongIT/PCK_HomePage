// 📁 파일 경로: app/layout.tsx

import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif-kr",
});

export const metadata: Metadata = {
  title: "팍스 크리스티 코리아 | Pax Christi Korea",
  description:
    "가톨릭 국제 평화운동 한국 지부 — 그리스도의 평화가 세상에",
  keywords: [
    "팍스 크리스티",
    "Pax Christi",
    "가톨릭",
    "평화운동",
    "한국",
    "평화",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${notoSerifKR.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
