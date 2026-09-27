import type { Metadata } from "next";
import "./globals.css";
import { WEDDING } from "@/lib/config";

// 링크 미리보기 문구도 config 에서 읽는다 — 날짜/시간이 바뀌어도 어긋나지 않도록
const { groom, bride, date } = WEDDING;
const shareTitle = `${groom.fullName} ♥ ${bride.fullName} 결혼합니다`;
const shareDescription = `${date.month}월 ${date.day}일 ${date.displayTime}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://becoming-one-team-wedding.vercel.app"),
  title: shareTitle,
  description: shareDescription,
  openGraph: {
    title: shareTitle,
    description: shareDescription,
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
