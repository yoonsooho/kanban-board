"use client";
import { useDeleteSchedules, useGetSchedules } from "@/app/hooks/useSchedules";
import { GetSchedulesType } from "@/type/ScheduleType";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { EditIcon } from "lucide-react";
import { Trash } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { PageLoading } from "@/components/ui/loading";
import { toast } from "@/hooks/use-toast";

const ScheduleList = () => {
    const queryClient = useQueryClient();
    const { data: schedules, isLoading } = useGetSchedules();
    const { openConfirm, ConfirmModal } = useConfirmModal();
    const { mutate: deleteSchedules } = useDeleteSchedules();

    const handleDeleteSchedule = (id: string) => {
        deleteSchedules(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["schedules"] });
                toast({
                    title: "일정 삭제 완료",
                    description: "일정 삭제 완료",
                    variant: "destructive",
                });
            },
            onError: (error) => {
                toast({
                    title: "일정 삭제 실패",
                    description: error.message,
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <ConfirmModal />
            {isLoading ? (
                <PageLoading text="일정을 로딩중입니다..." />
            ) : schedules && schedules.length > 0 ? (
                schedules.map((schedule: GetSchedulesType) => (
                    <Link
                        href={`main/schedules/${schedule.id}`}
                        key={`${schedule.title}-${schedule.startDate}`}
                        className="block group"
                    >
                        <div className="relative overflow-hidden border border-gray-200/60 p-6 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex justify-between items-center bg-white/80 backdrop-blur-sm">
                            <div className="flex-1">
                                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-3">
                                    {schedule.title}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-blue-700">시작일</span>
                                        <span className="text-sm text-blue-600 font-semibold">
                                            {schedule.startDate}
                                        </span>
                                    </div>
                                    {schedule.endDate && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-green-700">종료일</span>
                                            <span className="text-sm text-green-600 font-semibold">
                                                {schedule.endDate}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="hover:bg-blue-100 hover:text-blue-600 rounded-full p-2"
                                >
                                    <EditIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
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
                                    className="hover:bg-red-100 hover:text-red-600 rounded-full p-2"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">아직 등록된 일정이 없어요</h3>
                        <p className="text-gray-500 mb-6">새로운 일정을 등록해보세요!</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            위의 "새 일정 만들기" 버튼을 클릭하세요
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleList;
