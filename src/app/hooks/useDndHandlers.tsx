import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Items } from "../type/item";

interface DndHelpers {
    isMoveBoard: (id: string) => boolean;
    findBoard: (id: string) => number;
    getBoardItems: (index: number) => { id: string; name: string }[];
}

export const useDndHandlers = (
    items: Items,
    setItems: React.Dispatch<React.SetStateAction<Items>>,
    setActiveId: (id: string | null) => void,
    helpers: DndHelpers
) => {
    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id as string);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;

        const activeItemId = active.id as string;
        const overItemId = over.id as string;

        // 보드 이동
        if (helpers.isMoveBoard(activeItemId)) {
            const oldIndex = items.findIndex((c) => c.title === activeItemId);
            const newIndex = items.findIndex((c) => c.title === overItemId);
            setItems(arrayMove(items, oldIndex, newIndex));
            return;
        }

        // 같은 보드 내 아이템 이동
        const activeBoardIdx = helpers.findBoard(activeItemId);
        const overBoardIdx = helpers.findBoard(overItemId);
        if (activeBoardIdx === overBoardIdx && activeBoardIdx !== -1) {
            const boardItems = helpers.getBoardItems(activeBoardIdx);
            const oldIndex = boardItems.findIndex((item) => item.id === activeItemId);
            const newIndex = boardItems.findIndex((item) => item.id === overItemId);

            setItems((prev: Items) => {
                const newItems = [...prev];
                newItems[activeBoardIdx].items = arrayMove(boardItems, oldIndex, newIndex);
                return newItems;
            });
        }

        setActiveId(null);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!over) return;

        const activeBoard = helpers.findBoard(active.id as string);
        const isOverBoard = helpers.isMoveBoard(over.id as string);
        const overBoard = isOverBoard
            ? items.findIndex((c) => c.title === over.id)
            : helpers.findBoard(over.id as string);

        if (activeBoard === -1 || overBoard === -1 || activeBoard === overBoard) return;

        setItems((prev: Items) => {
            const newItems = [...prev];
            const activeItem = prev[activeBoard].items.find((item) => item.id === active.id);
            if (!activeItem) return prev;

            newItems[activeBoard].items = prev[activeBoard].items.filter((item) => item.id !== active.id);

            const overItems = newItems[overBoard].items;
            newItems[overBoard].items = isOverBoard
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
