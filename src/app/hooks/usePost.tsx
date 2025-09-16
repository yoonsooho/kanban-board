import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePosts, getPosts, postPosts } from "@/api/postApi";
import { PostPostsType } from "@/type/postPosts";
import { boards } from "@/type/boards";

export const useGetPosts = (scheduleId: number, initialData?: boards) => {
    return useQuery({
        queryKey: ["posts", scheduleId],
        enabled: !!scheduleId,
        queryFn: () => getPosts(scheduleId),
        initialData, // 서버에서 받은 posts 넣기
    });
};
export const usePostPosts = (id: number) => {
    return useMutation({
        mutationFn: (data: PostPostsType) => {
            return postPosts(id, data);
        },
    });
};
export const useDeletePosts = () => {
    return useMutation({
        mutationFn: (postId: number) => {
            return deletePosts(postId);
        },
    });
};
