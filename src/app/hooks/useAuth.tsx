import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, getUser, signOut } from "../api/authApi";
import { useRouter } from "next/navigation";
import { getAccessTokenFromCookie } from "@/lib/utils";

export const useSignIn = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: any) => signIn(data),
        onSuccess: (data) => {
            console.log("로그인 성공:", data);
            console.log("현재 경로:", window.location.pathname);
            // 쿠키 설정을 위한 약간의 대기
            setTimeout(() => {
                console.log("페이지 이동 시도 전");
                console.log("router 객체:", router);
                try {
                    router.push("/main");
                    console.log("router.push 실행 완료");
                } catch (error) {
                    console.error("router.push 에러:", error);
                }
            }, 100);
        },
        onError: (error) => {
            console.log(error);
        },
    });
};

export const useSignUp = () => {
    return useMutation({
        mutationFn: signUp,
    });
};

export const useGetUser = () => {
    const token = getAccessTokenFromCookie();
    return useQuery({
        queryKey: ["user", token], // 토큰을 쿼리 키에 포함
        enabled: !!token, // 토큰이 있을 때만 요청
        queryFn: getUser,
    });
};

export const useSignOut = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            // 모든 user 관련 쿼리를 무효화 (토큰 값에 상관없이)
            queryClient.invalidateQueries({ queryKey: ["user"] });
            router.refresh();
        },
        onError: (error) => {
            console.log("로그아웃 에러:", error);
        },
    });
};
