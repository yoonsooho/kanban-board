import { Items } from "@/app/type/item";
import React from "react";

const useBoardHandler = (setItems: React.Dispatch<React.SetStateAction<Items>>) => {
    // 새 보드 추가
    const handleAddBoard = (boardName: string) => {
        setItems((prev) => [...prev, { title: boardName, items: [] }]);
    };

    // 보드 이름 수정
    const handleEditBoard = (oldName: string, newName: string) => {
        setItems((prev) => prev.map((board) => (board.title === oldName ? { ...board, title: newName } : board)));
    };

    // 보드 삭제
    const handleDeleteBoard = (boardName: string) => {
        setItems((prev) => prev.filter((board) => board.title !== boardName));
    };
    return { handleAddBoard, handleEditBoard, handleDeleteBoard };
};

export default useBoardHandler;
