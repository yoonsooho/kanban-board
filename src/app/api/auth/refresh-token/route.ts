import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // refresh_token 쿠키에서 가져오기
        const refreshToken = request.cookies.get("refresh_token")?.value;

        if (!refreshToken) {
            console.log("refresh_token이 없습니다");
            return NextResponse.json({ error: "No refresh token" }, { status: 401 });
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다");
        }

        console.log("외부 API로 토큰 갱신 요청...");
        const startTime = Date.now();

        // 외부 API로 토큰 갱신 요청
        const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
            },
        });

        const endTime = Date.now();
        console.log(`API 응답 시간: ${endTime - startTime}ms`);

        if (!refreshResponse.ok) {
            console.log("토큰 갱신 실패:", refreshResponse.status);
            return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });
        }

        const responseData = await refreshResponse.json();
        const newAccessToken = responseData.access_token;
        const newRefreshToken = responseData.refresh_token;

        console.log("토큰 갱신 성공");

        // 응답 생성
        const response = NextResponse.json({ success: true });

        // 환경 정보 확인
        const isProduction = process.env.NODE_ENV === "production";
        const isHttps = request.nextUrl.protocol === "https:";

        // Access Token 쿠키 설정 (15분)
        if (newAccessToken) {
            response.cookies.set("access_token", newAccessToken, {
                maxAge: 15 * 60, // 15분 (초 단위)
                secure: isProduction && isHttps,
                sameSite: isProduction && isHttps ? "none" : "lax",
                path: "/",
            });
            console.log("새로운 access_token 쿠키 설정됨");
        }

        // Refresh Token 쿠키 설정 (7일)
        if (newRefreshToken) {
            response.cookies.set("refresh_token", newRefreshToken, {
                maxAge: 7 * 24 * 60 * 60, // 7일 (초 단위)
                secure: isProduction && isHttps,
                sameSite: isProduction && isHttps ? "none" : "lax",
                httpOnly: true, // XSS 방지
                path: "/",
            });
            console.log("새로운 refresh_token 쿠키 설정됨");
        }

        return response;
    } catch (error) {
        console.error("토큰 갱신 API 에러:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
