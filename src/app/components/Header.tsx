"use client";

import { useGetUser, useSignOut, useUserDelete } from "@/app/hooks/apiHook/useAuth";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { data: user, isLoading, error } = useGetUser();
    const signOutMutation = useSignOut();
    const userDeleteMutation = useUserDelete();
    const handleUserDelete = () => {
        userDeleteMutation.mutate(undefined, {
            onSuccess: () => {
                router.push("/");
            },
            onError: (error) => {
                console.log("회원탈퇴 에러:", error);
            },
        });
    };
    const checkPathname = (checkPath: string) => {
        let firstPath = pathname.split("/")[1];
        let firstCheckPath = checkPath.split("/")[1];
        return firstPath === firstCheckPath;
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link href="/main">
                                <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    const handleLogout = () => {
        signOutMutation.mutate();
    };

    if (isLoading) {
        return (
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link href="/main">
                                <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    if (error) {
        return (
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link href="/main">
                                <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-red-500 text-sm">사용자 정보 로딩 실패</span>
                            <Button onClick={handleLogout} variant="outline" size="sm">
                                로그아웃
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-24">
                        <Link href="/main">
                            <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
                        </Link>
                        <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
                            <Link
                                href="/main"
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                                    checkPathname("/main")
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                }`}
                            >
                                메인
                            </Link>
                            <Link
                                href="/diary"
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                                    checkPathname("/diary")
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                }`}
                            >
                                일기
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="flex flex-col text-right">
                                    <span className="text-sm font-medium text-gray-900">
                                        안녕하세요, {user.username} 님!
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button onClick={handleLogout} variant="outline" size="sm" disabled={signOutMutation.isPending}>
                            로그아웃
                        </Button>
                        <Button
                            onClick={handleUserDelete}
                            variant="outline"
                            size="sm"
                            disabled={userDeleteMutation.isPending}
                        >
                            회원탈퇴
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
