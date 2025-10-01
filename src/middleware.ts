import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const requestId = Math.random().toString(36).substring(7);
    // public 경로는 미들웨어 적용 안함 (/ 페이지는 토큰 체크 필요)
    if (
        pathname.startsWith("/auth") ||
        pathname.startsWith("/auth-loading") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml"
    ) {
        return NextResponse.next();
    }

    // 쿠키에서 access_token 확인
    const accessToken = request.cookies.get("access_token")?.value;

    // access_token이 있으면 처리
    if (accessToken) {
        // 로그인 페이지에 access_token으로 접근하면 메인으로 리다이렉트
        if (pathname === "/") {
            return NextResponse.redirect(new URL("/main", request.url));
        }
        // 다른 페이지는 그대로 진행

        return NextResponse.next();
    }

    // access_token이 없을 때만 refresh 시도

    // refresh_token이 있는지 확인
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
        // 이미 로그인 페이지면 그대로 진행
        if (pathname === "/") {
            return NextResponse.next();
        }
        // 다른 페이지면 로그인 페이지로 리다이렉트
        return NextResponse.redirect(new URL("/", request.url));
    }
    // refresh_token이 있으면 로딩 페이지로 리다이렉트

    // 로그인 페이지에서 refresh_token이 있으면 메인 페이지로 토큰 갱신 후 이동
    const redirectPath = pathname === "/" ? "/main" : request.nextUrl.pathname + request.nextUrl.search;
    const loadingUrl = new URL(`/auth-loading?redirect=${encodeURIComponent(redirectPath)}`, request.url);

    return NextResponse.redirect(loadingUrl);
}
