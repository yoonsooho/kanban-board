import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteContentItems, getContentItems, postContentItems } from "@/api/contentItem";
import { contentItems } from "@/type/contentItems";

// export const useGetContentItems = (postId: number) => {
//     return useQuery({
//         queryKey: ["contentItems", postId],
//         enabled: !!postId,
//         queryFn: () => getContentItems(postId),
//     });
// };
export const usePostContentItems = () => {
    return useMutation({
        mutationKey: ["contentItems"],
        mutationFn: (data: contentItems) => {
            return postContentItems(data);
        },
    });
};
export const useDeleteContentItems = () => {
    return useMutation({
        mutationKey: ["contentItems"],
        mutationFn: (id: number) => {
            return deleteContentItems(id);
        },
    });
};
