"use client";
import { SortableItem } from "@/app/components/SortableItem";
import addIcon from "@/assets/addIcon.png";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import moveIcon from "@/assets/moveIcon.png";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useState } from "react";
interface BoardProps {
    id: string;
    items: { id: string; name: string }[];
    isDragOverlay?: boolean;
    handleEditBoard?: (boardId: string, newName: string) => void;
    handleDeleteBoard?: (boardId: string) => void;
    handleEditItem?: (itemId: string, newName: string) => void;
    handleDeleteItem?: (itemId: string) => void;
    handleAddItem?: (boardId: string, itemName: string) => void;
    handleAddBoard?: (boardName: string) => void;
}

export function Board({
    id,
    items,
    isDragOverlay,
    handleEditBoard,
    handleDeleteBoard,
    handleEditItem,
    handleDeleteItem,
    handleAddBoard,
    handleAddItem,
}: BoardProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editValue, setEditValue] = useState(id);
    const [addValue, setAddValue] = useState("");
    const handleSubmit = () => {
        if (editValue.trim() && editValue !== id) {
            handleEditBoard?.(id, editValue);
        }
        setIsEditMode(false);
    };
    const handleAdd = () => {
        if (addValue.trim() && id) {
            handleAddItem?.(id, addValue);
            setAddValue("");
        }
    };

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        data: {
            type: "board",
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragOverlay ? "none" : transition,
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`w-96 p-4 bg-gray-100 rounded-lg min-h-[200px] relative
                ${isDragging ? "opacity-50" : ""}
                ${isDragOverlay ? "shadow-lg" : ""}
            `}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <button {...attributes} {...listeners} className="cursor-move shrink-0">
                        <Image src={moveIcon} alt="moveIcon" width={20} height={20} />
                    </button>
                    <button
                        className="p-2 hover:rounded-full hover:bg-gray-200 shrink-0"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEditMode(!isEditMode);
                        }}
                    >
                        <Image src={editIcon} alt="editIcon" width={20} height={20} />
                    </button>
                    <form className="flex items-center" onSubmit={handleSubmit}>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSubmit}
                                className="text-lg font-bold w-full"
                            />
                        ) : (
                            <h2 className="text-lg font-bold w-full">{id}</h2>
                        )}
                    </form>
                </div>

                <button
                    className="p-2 hover:rounded-full hover:bg-gray-200 shrink-0"
                    onClick={() => handleDeleteBoard?.(id)}
                >
                    <Image src={deleteIcon} alt="deleteIcon" width={20} height={20} />
                </button>
            </div>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        handleDeleteItem={handleDeleteItem}
                        handleEditItem={handleEditItem}
                    />
                ))}
            </SortableContext>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                }}
                className="flex items-center gap-2 mt-4 p-2 bg-white rounded-lg shadow-sm"
            >
                <input
                    type="text"
                    value={addValue}
                    onChange={(e) => setAddValue(e.target.value)}
                    placeholder="할일 추가"
                    className="flex-1 pl-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                />
                <button
                    type="submit"
                    disabled={!addValue.trim()}
                    className="p-2 hover:rounded-full hover:bg-gray-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    <div className="flex items-center">
                        <Image src={addIcon} alt="addIcon" width={20} height={20} />
                    </div>
                </button>
            </form>
        </div>
    );
}
