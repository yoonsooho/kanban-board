"use client";

import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useState } from "react";
import { Board } from "./Board";
import { SortableItem } from "./SortableItem";
import { Items } from "@/app/type/item";
import { helpers } from "@/app/lib/helpers";
import { useDndHandlers } from "@/app/hooks/useDndHandlers";
import { generateId } from "@/app/lib/generateId";
import useItemHandler from "@/app/hooks/useItemHandler";
import useBoardHandler from "@/app/hooks/useBoardHandler";

export default function DndBoard() {
    const [items, setItems] = useLocalStorage<Items>("items", [
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

    const helper = helpers(items);
    const handlers = useDndHandlers(items, setItems, setActiveId, helper);
    const { handleAddItem, handleEditItem, handleDeleteItem } = useItemHandler(setItems);
    const { handleAddBoard, handleEditBoard, handleDeleteBoard } = useBoardHandler(setItems);
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
                onDragStart={handlers.handleDragStart}
                onDragOver={handlers.handleDragOver}
                onDragEnd={handlers.handleDragEnd}
            >
                <SortableContext items={items.map((board) => board.title)} strategy={horizontalListSortingStrategy}>
                    <div className="flex gap-4 flex-wrap">
                        {items.map((board) => (
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
                                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        (helper.isMoveBoard(activeId) ? (
                            <Board
                                id={activeId}
                                items={items.find((c) => c.title === activeId)?.items || []}
                                isDragOverlay
                            />
                        ) : (
                            <SortableItem
                                id={activeId}
                                name={items.flatMap((c) => c.items).find((item) => item.id === activeId)?.name || ""}
                                isDragOverlay
                            />
                        ))}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
