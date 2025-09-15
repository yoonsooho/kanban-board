import { generateId } from "@/app/lib/generateId";
import { boards } from "@/app/type/item";
import React from "react";

const useItemHandler = (setItems: React.Dispatch<React.SetStateAction<boards>>) => {
    // 새 아이템 추가
    const handleAddItem = (boardId: number, itemName: string) => {
        if (itemName.trim() === "") return;

        // setItems((prev) => {
        //     return prev.map((el) => {
        //         if (el.id === boardId) {
        //             return { ...el, contentItems: [...el.contentItems, { name: itemName }] };
        //         }
        //         return el;
        //     });
        // });
    };

    // 아이템 이름 수정
    const handleEditItem = (itemId: number, newName: string) => {
        setItems((prev) =>
            prev.map((board) => ({
                ...board,
                contentItems: board.contentItems.map((item) =>
                    item.id === itemId ? { ...item, name: newName } : item
                ),
            }))
        );
    };

    // 아이템 삭제
    const handleDeleteItem = (itemId: number) => {
        setItems((prev) =>
            prev.map((board) => ({ ...board, contentItems: board.contentItems.filter((item) => item.id !== itemId) }))
        );
    };

    return { handleAddItem, handleEditItem, handleDeleteItem };
};

export default useItemHandler;
