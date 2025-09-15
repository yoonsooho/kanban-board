import Header from "@/app/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GoalDiary - 목표와 일기를 함께하는 스마트 작업관리",
    description:
        "GoalDiary는 개인의 목표, 명언, 일기와 팀 협업을 하나로 통합한 혁신적인 플랫폼입니다. 드래그 앤 드롭 칸반보드로 작업을 관리하고, 개인 성장과 팀 성과를 동시에 달성하세요.",
    keywords: [
        "목표관리",
        "일기앱",
        "개인성장",
        "칸반보드",
        "명언관리",
        "팀협업",
        "작업일지",
        "회고록",
        "GoalDiary",
        "개인목표달성",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}
