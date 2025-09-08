"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 동적 렌더링 강제 설정 (빌드 에러 방지)
export const dynamic = "force-dynamic";

export default function AuthLoadingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/main";

    useEffect(() => {
        const refreshToken = async () => {
            try {
                console.log("토큰 갱신 시작...");
                const response = await fetch("/api/auth/refresh-token", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    console.log("토큰 갱신 성공, 리다이렉트:", redirectUrl);
                    router.push(redirectUrl);
                } else {
                    console.log("토큰 갱신 실패, 로그인 페이지로 이동");
                    router.push("/");
                }
            } catch (error) {
                console.error("토큰 갱신 중 에러:", error);
                router.push("/");
            }
        };

        refreshToken();
    }, [router, redirectUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">인증 처리 중...</h2>
                <p className="text-gray-500">잠시만 기다려주세요. 로그인 정보를 확인하고 있습니다.</p>
            </div>
        </div>
    );
}
