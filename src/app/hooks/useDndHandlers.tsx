import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { boards } from "../../type/boards";
import { DndHelpers } from "../../type/dndHelpers";
import React from "react";

const useDndHandlers = (
    items: boards,
    setItems: React.Dispatch<React.SetStateAction<boards>>,
    setActiveId: (id: number | null) => void,
    helpers: DndHelpers,
    scheduleId: number
) => {
    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id as number);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;

        const activeItemId = active.id as number;
        const overItemId = over.id as number;

        // 보드 이동
        if (helpers.isSomeBoard(activeItemId)) {
            const oldIndex = items.findIndex((c) => c.id === activeItemId);
            const newIndex = items.findIndex((c) => c.id === overItemId);
            setItems(arrayMove(items, oldIndex, newIndex));
            return;
        }

        // 같은 보드 내 아이템 이동
        const activeBoardIdx = helpers.findBoardIdx(activeItemId);
        const overBoardIdx = helpers.findBoardIdx(overItemId);
        if (activeBoardIdx === overBoardIdx && activeBoardIdx !== -1) {
            const boardItems = helpers.getBoardItems(activeBoardIdx);
            const oldIndex = boardItems.findIndex((item) => item.id === activeItemId);
            const newIndex = boardItems.findIndex((item) => item.id === overItemId);

            setItems((prev: boards) => {
                const newItems = [...prev];
                newItems[activeBoardIdx].contentItems = arrayMove(boardItems, oldIndex, newIndex);
                return newItems;
            });
        }

        setActiveId(null);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!over) return;

        const activeBoardIdx = helpers.findBoardIdx(active.id as number);
        //오버된 아이템이 보드인지 확인
        const isOverBoard = helpers.isSomeBoard(over.id as number);

        //만약 오버된 요소가 보드가 아니라면 아이템 Index를 반환 보드가 맞다면 보드 Index를 반환
        const overBoardIdx = isOverBoard
            ? items.findIndex((el) => el.id === over.id)
            : helpers.findBoardIdx(over.id as number);

        if (activeBoardIdx === -1 || overBoardIdx === -1 || activeBoardIdx === overBoardIdx) return;

        setItems((prev: boards) => {
            const newItems = [...prev];
            const activeItem = prev[activeBoardIdx].contentItems.find((item) => item.id === active.id);
            if (!activeItem) return prev;

            newItems[activeBoardIdx].contentItems = prev[activeBoardIdx].contentItems.filter(
                (item) => item.id !== active.id
            );

            const overItems = newItems[overBoardIdx].contentItems;
            newItems[overBoardIdx].contentItems = isOverBoard
                ? [...overItems, activeItem]
                : overItems.length === 0
                ? [activeItem]
                : [
                      ...overItems.slice(
                          0,
                          overItems.findIndex((item) => item.id === over.id)
                      ),
                      activeItem,
                      ...overItems.slice(overItems.findIndex((item) => item.id === over.id)),
                  ];

            return newItems;
        });
    };

    return {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
    };
};

export default useDndHandlers;
