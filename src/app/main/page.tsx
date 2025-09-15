"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, EditIcon, PlusIcon } from "lucide-react";
import CreateScheduleModal from "@/app/components/CreateScheduleModal";
import { useGetSchedules, usePostSchedules, useDeleteSchedules } from "@/app/hooks/useSchedules";
import { GetSchedulesType, PostSchedulesType } from "@/app/type/ScheduleType";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useConfirmModal } from "@/components/ui/confirm-modal";

const Main = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { data: schedules } = useGetSchedules();
    const { mutate: postSchedules } = usePostSchedules();
    const { mutate: deleteSchedules } = useDeleteSchedules();
    const { openConfirm, ConfirmModal } = useConfirmModal();
    const handleCreateSchedule = async (data: PostSchedulesType) => {
        try {
            postSchedules(data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["schedules"] });
                },
            });
        } catch (error) {
            console.error("일정 생성 에러:", error);
            throw error; // 모달에서 에러 처리할 수 있도록 re-throw
        }
    };
    const handleDeleteSchedule = (id: string) => {
        deleteSchedules(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["schedules"] });
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                            <PlusIcon className="h-4 w-4" />새 일정 만들기
                        </Button>
                    </div>
                </div>

                <CreateScheduleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateSchedule}
                />
                <ConfirmModal />
                <div>
                    {schedules?.map((schedule: GetSchedulesType) => (
                        <Link
                            href={`main/schedules/${schedule.id}`}
                            key={`${schedule.title}-${schedule.startDate}`}
                            className="block"
                        >
                            <div className="border border-gray-300 p-4 rounded-md hover:bg-gray-100 transition-all duration-300 flex justify-between items-center">
                                <div>
                                    <h1 className="text-lg font-bold">{schedule.title}</h1>
                                    <p className="text-sm text-gray-500">{schedule.startDate}</p>
                                    <p className="text-sm text-gray-500">{schedule.endDate}</p>
                                </div>
                                <div>
                                    <Button
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.preventDefault(); // 링크 기본 동작 막기
                                            e.stopPropagation(); // 이벤트 버블링 막기
                                        }}
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        className="hover:bg-red-500 hover:text-white"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openConfirm(() => handleDeleteSchedule(schedule.id), {
                                                title: "일정 삭제",
                                                description: `"${schedule.title}" 일정을 정말 삭제하시겠습니까?`,
                                                confirmText: "삭제",
                                                cancelText: "취소",
                                                variant: "destructive",
                                            });
                                        }}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Main;
