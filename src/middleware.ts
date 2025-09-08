import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 미들웨어 시작: ${pathname}`);

    // 로그인 페이지와 public 경로는 미들웨어 적용 안함
    if (
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api")
    ) {
        console.log(`[${requestId}] 공개 경로, 패스`);
        return NextResponse.next();
    }

    // 쿠키에서 access_token 확인
    const accessToken = request.cookies.get("access_token")?.value;
    console.log(`[${requestId}] access_token 존재:`, !!accessToken);

    // access_token이 있으면 그대로 진행
    if (accessToken) {
        console.log(`[${requestId}] access_token 있음, 통과`);
        return NextResponse.next();
    }

    // access_token이 없을 때만 refresh 시도

    // refresh_token이 있는지 확인
    const refreshToken = request.cookies.get("refresh_token")?.value;
    console.log(`[${requestId}] refresh_token 존재:`, !!refreshToken);
    if (!refreshToken) {
        console.log(`[${requestId}] refresh_token 없음, 로그인 페이지로 리다이렉트`);
        return NextResponse.redirect(new URL("/", request.url));
    }
    console.log(`[${requestId}] refresh_token 있음, 갱신 시도`);
    console.log("환경 변수 확인:", {
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        nodeEnv: process.env.NODE_ENV,
        host: request.headers.get("host"),
        protocol: request.nextUrl.protocol,
    });

    try {
        console.log(`[${requestId}] API 요청 시작...`);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다");
        }

        const startTime = Date.now();
        // refresh 토큰으로 새로운 access_token 요청 (타임아웃 설정)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

        const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`[${requestId}] API 응답 시간: ${responseTime}ms`);

        if (responseTime > 3000) {
            console.warn(`[${requestId}] ⚠️ 서버 응답이 느림: ${responseTime}ms`);
        }

        if (refreshResponse.ok) {
            console.log(`[${requestId}] 토큰 갱신 성공 (${refreshResponse.status})`);

            // 응답에서 토큰 추출
            const responseData = await refreshResponse.json();
            console.log("응답 데이터:", responseData);

            const newAccessToken = responseData.access_token;
            const newRefreshToken = responseData.refresh_token;

            // 새로운 응답 생성
            const response = NextResponse.next();

            // 배포 환경 정보 로깅
            const isProduction = process.env.NODE_ENV === "production";
            const isHttps = request.nextUrl.protocol === "https:";
            console.log("쿠키 설정 환경:", { isProduction, isHttps });

            // Access Token 쿠키 설정 (15분)
            if (newAccessToken) {
                const cookieOptions = {
                    maxAge: 15 * 60, // 15분 (초 단위)
                    secure: isProduction && isHttps, // HTTPS에서만 secure
                    sameSite: isProduction && isHttps ? "none" : "lax",
                    path: "/",
                };
                console.log(`[${requestId}] access_token 쿠키 옵션:`, cookieOptions);
                response.cookies.set("access_token", newAccessToken, cookieOptions as any);
                console.log(
                    `[${requestId}] 새로운 access_token 쿠키 설정됨 - 값: ${newAccessToken.substring(0, 20)}...`
                );
            }

            // Refresh Token 쿠키 설정 (7일)
            if (newRefreshToken) {
                const cookieOptions = {
                    maxAge: 7 * 24 * 60 * 60, // 7일 (초 단위)
                    secure: isProduction && isHttps, // HTTPS에서만 secure
                    sameSite: isProduction && isHttps ? "none" : "lax",
                    httpOnly: true, // XSS 방지
                    path: "/",
                };
                console.log(`[${requestId}] refresh_token 쿠키 옵션:`, cookieOptions);
                response.cookies.set("refresh_token", newRefreshToken, cookieOptions as any);
                console.log(`[${requestId}] 새로운 refresh_token 쿠키 설정됨`);
            }

            console.log(`[${requestId}] 미들웨어 완료 - 쿠키 설정 후 다음 페이지로 진행`);
            return response;
        } else {
            console.log("토큰 갱신 실패 - 상태:", refreshResponse.status);
            console.log("응답 헤더:", Object.fromEntries(refreshResponse.headers.entries()));
            const errorText = await refreshResponse.text();
            console.log("응답 내용:", errorText);
            return NextResponse.redirect(new URL("/", request.url));
        }
    } catch (error) {
        console.error(`[${requestId}] fetch 에러 발생:`, error);
        console.error(`[${requestId}] 에러 타입:`, typeof error);
        console.error(`[${requestId}] 에러 메시지:`, error instanceof Error ? error.message : String(error));

        // 타임아웃 에러인지 확인
        if (error instanceof Error && error.name === "AbortError") {
            console.error(`[${requestId}] ⏱️ 서버 응답 타임아웃 (10초 초과)`);
        }

        // 에러 발생 시 로그인 페이지로 리다이렉트
        return NextResponse.redirect(new URL("/", request.url));
    }
}
