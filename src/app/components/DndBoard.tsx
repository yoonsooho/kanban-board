"use client";

import useBoardHandler from "@/app/hooks/useBoardHandler";

import useDndHandlers from "@/app/hooks/useDndHandlers";
import useItemHandler from "@/app/hooks/useItemHandler";
import { helpers } from "@/app/lib/helpers";
import { boards } from "@/app/type/item";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useState } from "react";
import { Board } from "./Board";
import { SortableItem } from "./SortableItem";

export default function DndBoard() {
    const [boards, setBoards] = useLocalStorage<boards>("boards", [
        {
            title: "board1",
            items: [
                { id: "1", name: "Item 1" },
                { id: "2", name: "Item 2" },
            ],
        },
        {
            title: "board2",
            items: [
                { id: "3", name: "Item 3" },
                { id: "4", name: "Item 4" },
            ],
        },
    ]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [newBoard, setNewBoard] = useState("");

    const helper = helpers(boards);
    const { handleDragStart, handleDragEnd, handleDragOver } = useDndHandlers(boards, setBoards, setActiveId, helper);
    const { handleAddItem, handleEditItem, handleDeleteItem } = useItemHandler(setBoards);
    const { handleAddBoard, handleEditBoard, handleDeleteBoard } = useBoardHandler(setBoards);
    // 센서 설정
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="p-8">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={boards.map((board) => board.title)} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-wrap gap-4">
                        {boards.map((board) => (
                            <Board
                                key={board.title}
                                id={board.title}
                                items={board.items}
                                handleEditBoard={handleEditBoard}
                                handleDeleteBoard={handleDeleteBoard}
                                handleAddBoard={handleAddBoard}
                                handleEditItem={handleEditItem}
                                handleDeleteItem={handleDeleteItem}
                                handleAddItem={handleAddItem}
                            />
                        ))}
                        <div className="w-96 p-4 bg-gray-100 rounded-lg min-h-[200px] relative flex flex-col">
                            <h2 className="mb-6 text-lg font-bold text-gray-700">Add board</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (boards.some((board) => board.title === newBoard)) {
                                        alert("이미 존재하는 보드입니다.");
                                        return;
                                    }
                                    if (!newBoard.trim()) return; // 빈 문자열 체크
                                    handleAddBoard(newBoard);
                                    setNewBoard("");
                                }}
                                className="flex flex-col gap-2"
                            >
                                <input
                                    type="text"
                                    value={newBoard}
                                    onChange={(e) => setNewBoard(e.target.value)}
                                    placeholder="보드 이름을 적어주세요."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={!newBoard.trim()}
                                    className="w-full px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add board
                                </button>
                            </form>
                        </div>
                    </div>
                </SortableContext>

                {/* dnd 오버레이(dnd 애니메이션 효과) */}
                <DragOverlay>
                    {activeId &&
                        (helper.isSomeBoard(activeId) ? (
                            <Board
                                id={activeId}
                                items={boards.find((c) => c.title === activeId)?.items || []}
                                isDragOverlay
                            />
                        ) : (
                            <SortableItem
                                id={activeId}
                                name={boards.flatMap((c) => c.items).find((item) => item.id === activeId)?.name || ""}
                                isDragOverlay
                            />
                        ))}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
