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
  title: "ZTO 供应链智能预警控制塔 - AI 规则配置画布与协作审计台",
  description: "中通供应链智能预警控制系统，支持自然语言解析(NLP DSL)、“活水池”大屏监控实时报警看板、设备二次校准隐性闭环消警审计以及数据资产ClickHouse映射封装。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-gray-200">
        {children}
      </body>
    </html>
  );
}
