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
                    console.log("Next.js 15.1 테스트: router.push 사용");
                    router.push("/main");
                    console.log("router.push 실행 완료");

                    // 5초 후에도 페이지 이동이 안 되면 fallback
                    setTimeout(() => {
                        console.log("5초 후 현재 경로 재확인:", window.location.pathname);
                        if (window.location.pathname === "/") {
                            console.log("router.push 실패, fallback으로 window.location.href 사용");
                            window.location.href = "/main";
                        } else {
                            console.log("✅ router.push 성공! Next.js 15.1에서 정상 작동");
                        }
                    }, 5000);
                } catch (error) {
                    console.error("router.push 에러:", error);
                    window.location.href = "/main";
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
