import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] 미들웨어 시작: ${pathname}`);

    // public 경로는 미들웨어 적용 안함 (/ 페이지는 토큰 체크 필요)
    if (
        pathname.startsWith("/auth") ||
        pathname.startsWith("/auth-loading") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api")
    ) {
        console.log(`[${requestId}] 공개 경로, 패스`);
        return NextResponse.next();
    }

    // 쿠키에서 access_token 확인
    const accessToken = request.cookies.get("access_token")?.value;
    console.log(`[${requestId}] access_token 존재:`, !!accessToken);

    // access_token이 있으면 처리
    if (accessToken) {
        console.log(`[${requestId}] access_token 있음`);
        // 로그인 페이지에 access_token으로 접근하면 메인으로 리다이렉트
        if (pathname === "/") {
            console.log(`[${requestId}] 로그인 페이지에 토큰 있음, 메인으로 리다이렉트`);
            return NextResponse.redirect(new URL("/main", request.url));
        }
        // 다른 페이지는 그대로 진행
        console.log(`[${requestId}] 다른 페이지, 통과`);
        return NextResponse.next();
    }

    // access_token이 없을 때만 refresh 시도

    // refresh_token이 있는지 확인
    const refreshToken = request.cookies.get("refresh_token")?.value;
    console.log(`[${requestId}] refresh_token 존재:`, !!refreshToken);
    if (!refreshToken) {
        console.log(`[${requestId}] refresh_token 없음`);
        // 이미 로그인 페이지면 그대로 진행
        if (pathname === "/") {
            console.log(`[${requestId}] 이미 로그인 페이지, 통과`);
            return NextResponse.next();
        }
        // 다른 페이지면 로그인 페이지로 리다이렉트
        console.log(`[${requestId}] 로그인 페이지로 리다이렉트`);
        return NextResponse.redirect(new URL("/", request.url));
    }
    // refresh_token이 있으면 로딩 페이지로 리다이렉트
    console.log(`[${requestId}] refresh_token 있음, 로딩 페이지로 리다이렉트`);

    // 로그인 페이지에서 refresh_token이 있으면 메인 페이지로 토큰 갱신 후 이동
    const redirectPath = pathname === "/" ? "/main" : request.nextUrl.pathname + request.nextUrl.search;
    const loadingUrl = new URL(`/auth-loading?redirect=${encodeURIComponent(redirectPath)}`, request.url);

    return NextResponse.redirect(loadingUrl);
}
