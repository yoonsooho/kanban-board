import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 로그인 페이지와 public 경로는 미들웨어 적용 안함
    if (
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    // 쿠키에서 access_token 확인
    const accessToken = request.cookies.get("access_token")?.value;

    // access_token이 있으면 그대로 진행
    if (accessToken) {
        return NextResponse.next();
    }

    // access_token이 없을 때만 refresh 시도

    // refresh_token이 있는지 확인
    const refreshToken = request.cookies.get("refresh_token")?.value;
    console.log("refreshToken", refreshToken);
    if (!refreshToken) {
        console.log("refreshToken 없음");
        return NextResponse.redirect(new URL("/", request.url));
    }
    console.log("refreshToken 있음");
    try {
        console.log("fetch 요청 시작...");
        // refresh 토큰으로 새로운 access_token 요청
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
            },
        });

        if (refreshResponse.ok) {
            console.log("토큰 갱신 성공");

            // 응답에서 토큰 추출
            const responseData = await refreshResponse.json();
            console.log("응답 데이터:", responseData);

            const newAccessToken = responseData.access_token;
            const newRefreshToken = responseData.refresh_token;

            // 새로운 응답 생성
            const response = NextResponse.next();

            // Access Token 쿠키 설정 (15분)
            if (newAccessToken) {
                response.cookies.set("access_token", newAccessToken, {
                    maxAge: 15 * 60, // 15분 (초 단위)
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    path: "/",
                });
                console.log("새로운 access_token 쿠키 설정됨");
            }

            // Refresh Token 쿠키 설정 (7일)
            if (newRefreshToken) {
                response.cookies.set("refresh_token", newRefreshToken, {
                    maxAge: 7 * 24 * 60 * 60, // 7일 (초 단위)
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    httpOnly: true, // XSS 방지
                    path: "/",
                });
                console.log("새로운 refresh_token 쿠키 설정됨");
            }

            return response;
        } else {
            console.log("토큰 갱신 실패 - 상태:", refreshResponse.status);
            return NextResponse.redirect(new URL("/", request.url));
        }
    } catch (error) {
        console.error("fetch 에러 발생:", error);
        console.error("에러 타입:", typeof error);
        console.error("에러 메시지:", error instanceof Error ? error.message : String(error));
        // 에러 발생 시 로그인 페이지로 리다이렉트
        return NextResponse.redirect(new URL("/", request.url));
    }
}
