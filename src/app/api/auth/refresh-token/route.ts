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
        console.log("토큰 갱신 성공 - 백엔드에서 쿠키 설정됨");

        // 백엔드 응답의 쿠키를 브라우저로 전달
        const response = NextResponse.json({ success: true, data: responseData });

        // 백엔드 응답의 Set-Cookie 헤더를 그대로 전달
        const setCookieHeaders = refreshResponse.headers.get("set-cookie");
        console.log("setCookieHeaders", setCookieHeaders);
        if (setCookieHeaders) {
            response.headers.set("Set-Cookie", setCookieHeaders);
        }

        return response;
    } catch (error) {
        console.error("토큰 갱신 API 에러:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
