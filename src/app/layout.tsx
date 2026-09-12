import type { Metadata } from "next";
import "./globals.css";
import { WEDDING } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL("https://becoming-one-team-wedding.vercel.app"),
  title: "곡원성 ♥ 이승연 결혼합니다",
  description: "12월 5일 오후 1시 30분",
  openGraph: {
    title: "곡원성 ♥ 이승연 결혼합니다",
    description: "12월 5일 오후 1시 30분",
    images: [WEDDING.photos[0]],
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
