"use client";

import useBoardHandler from "@/app/hooks/useBoardHandler";

import useDndHandlers from "@/app/hooks/useDndHandlers";
import useItemHandler from "@/app/hooks/useItemHandler";
import { helpers } from "@/app/lib/helpers";
import { boards } from "@/type/boards";
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
import { Suspense, useLayoutEffect, useState } from "react";
import { Board } from "./Board";
import { SortableItem } from "./SortableItem";
import { useGetPosts } from "@/app/hooks/apiHook/usePost";
import { PageLoading } from "@/components/ui/loading";
import { toast } from "@/hooks/use-toast";
import { useMutationState } from "@tanstack/react-query";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function DndBoard({ scheduleId }: { scheduleId: number }) {
    const { data: boardsData } = useGetPosts(scheduleId);
    console.log("boardsData", boardsData);
    const [boards, setBoards] = useState<boards>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeId, setActiveId] = useState<number | null>(null);
    const [newBoard, setNewBoard] = useState("");
    const helper = helpers(boards);
    const { handleDragStart, handleDragEnd, handleDragOver } = useDndHandlers(
        boards,
        setBoards,
        setActiveId,
        helper,
        scheduleId
    );
    const { handleAddItem, handleEditItem, handleDeleteItem } = useItemHandler(setBoards);
    const { handleAddBoard, handleEditBoard, handleDeleteBoard } = useBoardHandler(setBoards, scheduleId);
    // 센서 설정
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    console.log("activeId", activeId);

    const postsPending = useMutationState({
        filters: { status: "pending", mutationKey: ["posts"] },
    });
    const contentItemsPending = useMutationState({
        filters: { status: "pending", mutationKey: ["contentItems"] },
    });

    useLayoutEffect(() => {
        if (boardsData) setBoards(boardsData);
        setIsLoading(false);
    }, [boardsData]);

    if (isLoading) return <PageLoading text="일정을 로딩중입니다..." />;

    const isMutating = postsPending.length > 0 || contentItemsPending.length > 0;

    return (
        <div className="p-8">
            <LoadingOverlay open={isMutating} text="업데이트 중입니다..." />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={boards.map((board) => board.id)}>
                    <div className="flex flex-wrap gap-4">
                        {boards?.map((board) => (
                            <Board
                                key={board.id}
                                id={board.id}
                                title={board.title}
                                items={board.contentItems}
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
                                id={Number(activeId)}
                                title={boards.find((c) => c.id === activeId)?.title || ""}
                                items={boards.find((c) => c.id === activeId)?.contentItems || []}
                                isDragOverlay
                            />
                        ) : (
                            <SortableItem
                                id={Number(activeId)}
                                name={
                                    boards.flatMap((c) => c.contentItems).find((item) => item.id === Number(activeId))
                                        ?.text || ""
                                }
                                isDragOverlay
                            />
                        ))}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
