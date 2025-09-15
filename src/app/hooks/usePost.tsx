import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePosts, getPosts, postPosts } from "@/lib/postApi";
import { PostPostsType } from "@/app/type/postPosts";
import { boards } from "@/app/type/item";

export const useGetPosts = (id: number, initialData?: boards) => {
    return useQuery({
        queryKey: ["posts", id],
        enabled: !!id,
        queryFn: () => getPosts(id),
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
