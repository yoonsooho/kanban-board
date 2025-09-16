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
        <div>
            <ConfirmModal />
            {isLoading ? (
                <PageLoading text="일정을 로딩중입니다..." />
            ) : (
                schedules?.map((schedule: GetSchedulesType) => (
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
                ))
            )}
        </div>
    );
};

export default ScheduleList;
