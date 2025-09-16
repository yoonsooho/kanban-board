import { commonApi, commonApiJson } from "@/api/commonApi";
import { contentItems } from "@/type/contentItems";

export const getContentItems = async (postId: number) => {
    return await commonApiJson(`/api/content-items?postId=${postId}`, {
        method: "GET",
        requireAuth: true, // 일정 조회는 인증이 필요
    });
};

export const postContentItems = async (data: contentItems) => {
    return await commonApiJson(`/api/content-items`, {
        method: "POST",
        body: data,
        requireAuth: true, // 일정 생성은 인증이 필요
    });
};

export const deleteContentItems = async (id: number) => {
    // 삭제는 빈 응답을 반환할 수 있으므로 commonApi 사용
    const response = await commonApi(`/api/content-items/${id}`, {
        method: "DELETE",
        requireAuth: true, // 일정 삭제는 인증이 필요
    });

    // 응답이 비어있으면 성공 메시지 반환, 있으면 JSON 파싱
    if (response.headers.get("content-length") === "0" || response.status === 204) {
        return { success: true, message: "삭제 완료" };
    }

    try {
        return await response.json();
    } catch {
        return { success: true, message: "삭제 완료" };
    }
};
