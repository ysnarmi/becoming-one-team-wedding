import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "곡원성 ♥ 이승연 결혼합니다",
  description: "12월 5일 오후 1시 30분",
  openGraph: {
    title: "곡원성 ♥ 이승연 결혼합니다",
    description: "12월 5일 오후 1시 30분",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
