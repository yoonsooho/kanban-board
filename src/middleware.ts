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
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        // refresh 토큰으로 새로운 access_token 요청
        const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/refresh`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (refreshResponse.ok) {
            // 새로운 쿠키를 응답에 포함
            const response = NextResponse.next();

            // refresh API에서 받은 모든 Set-Cookie 헤더를 복사
            const cookies = refreshResponse.headers.getSetCookie();
            cookies.forEach((cookie) => {
                response.headers.append("Set-Cookie", cookie);
            });

            return response;
        } else {
            // refresh 실패 시 로그인 페이지로 리다이렉트
            return NextResponse.redirect(new URL("/", request.url));
        }
    } catch (error) {
        // 에러 발생 시 로그인 페이지로 리다이렉트
        return NextResponse.redirect(new URL("/", request.url));
    }
}
