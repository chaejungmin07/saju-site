import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사주명리 - AI 사주 분석",
  description: "생년월일시로 보는 정밀 사주팔자 분석. 천간지지, 오행, 십성, 대운, 세운까지 AI가 전문적으로 해석해드립니다.",
  keywords: "사주, 사주팔자, 사주명리, 운세, 대운, 세운, AI사주",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
