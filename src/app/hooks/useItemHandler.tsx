import { generateId } from "@/app/lib/generateId";
import { boards } from "@/app/type/item";
import React from "react";

const useItemHandler = (setItems: React.Dispatch<React.SetStateAction<boards>>) => {
    // 새 아이템 추가
    const handleAddItem = (boardName: string, itemName: string) => {
        if (itemName.trim() === "") return;
        setItems((prev) => {
            return prev.map((el) => {
                if (el.title === boardName) {
                    return { ...el, items: [...el.items, { id: generateId(), name: itemName }] };
                }
                return el;
            });
        });
    };

    // 아이템 이름 수정
    const handleEditItem = (itemId: string, newName: string) => {
        setItems((prev) =>
            prev.map((board) => ({
                ...board,
                items: board.items.map((item) => (item.id === itemId ? { ...item, name: newName } : item)),
            }))
        );
    };

    // 아이템 삭제
    const handleDeleteItem = (itemId: string) => {
        setItems((prev) =>
            prev.map((board) => ({ ...board, items: board.items.filter((item) => item.id !== itemId) }))
        );
    };

    return { handleAddItem, handleEditItem, handleDeleteItem };
};

export default useItemHandler;
