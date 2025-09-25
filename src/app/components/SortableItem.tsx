"use client";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import moveIcon from "@/assets/moveIcon.png";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
interface SortableItemProps {
    id: number;
    name: string;
    isDragOverlay?: boolean;
    handleDeleteItem?: (itemId: number) => void;
    handleEditItem?: (itemId: number, newName: string) => void;
}

export function SortableItem({ id, name, isDragOverlay, handleDeleteItem, handleEditItem }: SortableItemProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editValue, setEditValue] = useState(name);
    const editRef = useRef<HTMLInputElement>(null);
    const handleSubmit = () => {
        if (editValue.trim() && editValue !== name) {
            handleEditItem?.(id, editValue);
        }
        setIsEditMode(false);
    };

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        disabled: isDragOverlay,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragOverlay ? undefined : "transform 300ms cubic-bezier(0.25, 1, 0.5, 1)",
        opacity: isDragging ? 0.3 : 1,
        scale: isDragOverlay ? 1.05 : 1,
    };
    useEffect(() => {
        if (isEditMode) {
            editRef.current?.focus();
        }
    }, [isEditMode]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-4 mb-2 bg-white rounded shadow transition-shadow duration-300  
                ${isDragging ? "border-2 border-blue-500" : ""}
                ${isDragOverlay ? "shadow-lg" : ""}
            `}
        >
            <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <span {...attributes} {...listeners} className="cursor-move">
                        <Image src={moveIcon} alt="moveIcon" width={20} height={20} />
                    </span>
                    <button
                        className="p-2 hover:rounded-full hover:bg-gray-200 shrink-0"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEditMode(!isEditMode);
                        }}
                    >
                        <Image src={editIcon} alt="editIcon" width={20} height={20} />
                    </button>
                    <form
                        className="flex items-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {isEditMode ? (
                            <input
                                ref={editRef}
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="text-lg font-bold w-[200px]"
                            />
                        ) : (
                            <h2 className="text-lg font-bold w-[200px]">{name}</h2>
                        )}
                    </form>
                </div>
                <button
                    className="p-2 hover:rounded-full hover:bg-gray-200 shrink-0"
                    onClick={() => handleDeleteItem?.(id)}
                >
                    <Image src={deleteIcon} alt="deleteIcon" width={20} height={20} />
                </button>
            </div>
        </div>
    );
}
