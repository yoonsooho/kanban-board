"use client";

import { useGetUser, useSignOut } from "@/app/hooks/apiHook/useAuth";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { data: user, isLoading, error } = useGetUser();
    const signOutMutation = useSignOut();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
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
                            <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
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
                            <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
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
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-semibold text-gray-900">Goal Diary</h1>
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
                    </div>
                </div>
            </div>
        </header>
    );
}
