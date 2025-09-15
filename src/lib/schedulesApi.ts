import { commonApiJson } from "@/lib/commonApi";
import { PostSchedulesType } from "@/app/type/postSchedule";

export const getSchedules = async () => {
    return await commonApiJson("/api/schedules", {
        method: "GET",
        requireAuth: true, // 일정 조회는 인증이 필요
    });
};

export const postSchedules = async (data: PostSchedulesType) => {
    return await commonApiJson("/api/schedules", {
        method: "POST",
        body: data,
        requireAuth: true, // 일정 생성은 인증이 필요
    });
};
