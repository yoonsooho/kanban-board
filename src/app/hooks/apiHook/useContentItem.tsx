import { useMutation } from "@tanstack/react-query";
import { deleteContentItems, postContentItems, updateMoveContentItems } from "@/api/contentItem";
import { moveContentItems, postContentItemsType } from "@/type/contentItems";

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
        mutationFn: (data: postContentItemsType) => {
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

export const useUpdateMoveContentItems = () => {
    return useMutation({
        mutationKey: ["contentItems"],
        mutationFn: (data: moveContentItems) => {
            return updateMoveContentItems(data);
        },
    });
};
