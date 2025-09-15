import { useDeletePosts, usePostPosts } from "@/app/hooks/usePost";
import { boards } from "@/app/type/item";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

const useBoardHandler = (setItems: React.Dispatch<React.SetStateAction<boards>>, scheduleId: number) => {
    const queryClient = useQueryClient();
    const { mutate: postPosts } = usePostPosts(scheduleId);
    const { mutate: deletePosts } = useDeletePosts();
    // 새 보드 추가
    const handleAddBoard = (boardName: string) => {
        postPosts(
            { title: boardName },
            {
                onSuccess: (newBoard) => {
                    console.log("보드 생성 성공:", newBoard);
                    queryClient.invalidateQueries({ queryKey: ["posts", scheduleId] });
                },
                onError: (error) => {
                    console.error("보드 생성 실패:", error);
                },
            }
        );
    };

    // 보드 이름 수정
    const handleEditBoard = (id: number, newName: string) => {
        setItems((prev) => prev.map((board) => (board.id === id ? { ...board, title: newName } : board)));
    };

    // 보드 삭제
    const handleDeleteBoard = (boardId: number) => {
        console.log("삭제 시도:", boardId);
        deletePosts(boardId, {
            onSuccess: (data) => {
                console.log("삭제 성공:", data);
                queryClient.invalidateQueries({ queryKey: ["posts", scheduleId] });
            },
            onError: (error) => {
                console.error("삭제 실패:", error);
            },
        });
    };
    return { handleAddBoard, handleEditBoard, handleDeleteBoard };
};

export default useBoardHandler;
