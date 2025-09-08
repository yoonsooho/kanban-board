import { getAccessTokenFromCookie } from "@/lib/utils";

export const signIn = async (data: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    const result = await response.json();

    // 쿠키는 서버에서 자동으로 설정됨
    return result;
};

export const signUp = async (data: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getUser = async () => {
    const token = getAccessTokenFromCookie();
    const headers: any = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/users/me`, {
        method: "GET",
        headers,
        credentials: "include",
    });

    if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        (error as any).response = response;
        throw error;
    }

    return response.json();
};

export const signOut = async () => {
    const token = getAccessTokenFromCookie();
    const headers: any = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/signout`, {
        method: "POST",
        headers,
        credentials: "include",
    });
    return response.json();
};
