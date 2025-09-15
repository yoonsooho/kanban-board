import { useMutation, useQuery } from "@tanstack/react-query";
import { getAccessTokenFromCookie } from "@/lib/utils";
import { getSchedules, postSchedules } from "@/lib/schedulesApi";
import { PostSchedulesType } from "@/app/type/postSchedule";

export const useGetSchedules = () => {
    const token = getAccessTokenFromCookie();
    return useQuery({
        queryKey: ["schedules", token], // 토큰을 쿼리 키에 포함
        enabled: !!token, // 토큰이 있을 때만 요청
        queryFn: getSchedules,
    });
};
export const usePostSchedules = () => {
    return useMutation({
        mutationFn: (data: PostSchedulesType) => {
            return postSchedules(data);
        },
    });
};
