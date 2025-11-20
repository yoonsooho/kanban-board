"use client";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import moveIcon from "@/assets/moveIcon.png";
import { patchContentItemsType } from "@/type/contentItems";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
interface SortableItemProps {
    id: number;
    name: string;
    startTime?: string | null;
    endTime?: string | null;
    isDragOverlay?: boolean;
    handleDeleteItem?: (itemId: number) => void;
    handleEditItem?: (itemId: number, data: patchContentItemsType) => void;
}

export function SortableItem({
    id,
    name,
    startTime = null,
    endTime = null,
    isDragOverlay,
    handleDeleteItem,
    handleEditItem,
}: SortableItemProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editValue, setEditValue] = useState(name);
    const [editStartTime, setEditStartTime] = useState(startTime || "");
    const [editEndTime, setEditEndTime] = useState(endTime || "");
    const editRef = useRef<HTMLTextAreaElement>(null);
    const handleSubmit = () => {
        handleEditItem?.(id, {
            text: editValue,
            startTime: editStartTime,
            endTime: editEndTime,
        });
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
            <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1">
                    <span {...attributes} {...listeners} className="cursor-move shrink-0 mt-1" suppressHydrationWarning>
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
                    <div className="flex-1">
                        <form
                            className="flex items-center"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            {isEditMode ? (
                                <textarea
                                    ref={editRef}
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                    className="text-lg font-bold w-full resize-none"
                                    cols={10}
                                    rows={3}
                                />
                            ) : (
                                <h2 className="text-lg font-bold w-full break-words whitespace-pre-wrap">{name}</h2>
                            )}
                        </form>
                        {/* 시간 입력 필드 */}

                        {/* 시간 표시 (편집 모드가 아닐 때) */}
                        {!isEditMode && (startTime || endTime) ? (
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                {startTime && <span>{startTime}</span>}
                                {startTime && endTime && <span>~</span>}
                                {endTime && <span>{endTime}</span>}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="time"
                                    value={editStartTime}
                                    onChange={(e) => setEditStartTime(e.target.value)}
                                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="시작 시간"
                                />
                                <span className="text-gray-400">~</span>
                                <input
                                    type="time"
                                    value={editEndTime}
                                    onChange={(e) => setEditEndTime(e.target.value)}
                                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="종료 시간"
                                />
                                <button
                                    className="p-2 hover:rounded-full hover:bg-gray-200 shrink-0 text-sm text-gray-600"
                                    onClick={() => {
                                        setIsEditMode(true);
                                        handleSubmit();
                                    }}
                                >
                                    저장하기
                                </button>
                            </div>
                        )}
                    </div>
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
