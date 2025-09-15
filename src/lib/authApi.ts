import { commonApiJson } from "@/lib/commonApi";

export const signIn = async (data: any) => {
    return await commonApiJson("/api/auth/signin", {
        method: "POST",
        body: data,
        requireAuth: false, // 로그인은 인증이 필요없음
    });
};

export const signUp = async (data: any) => {
    return await commonApiJson("/api/auth/signup", {
        method: "POST",
        body: data,
        requireAuth: false, // 회원가입은 인증이 필요없음
    });
};

export const getUser = async () => {
    return await commonApiJson("/api/users/me", {
        method: "GET",
        requireAuth: true, // 사용자 정보는 인증이 필요
    });
};

export const signOut = async () => {
    return await commonApiJson(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/signout`, {
        method: "POST",
        requireAuth: true, // 로그아웃은 인증이 필요
    });
};
