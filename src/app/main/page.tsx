"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateScheduleModal from "@/app/components/main/modal/CreateScheduleModal";
import { usePostSchedules } from "@/app/hooks/apiHook/useSchedules";
import { PostSchedulesType } from "@/type/ScheduleType";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ScheduleList from "@/app/components/main/ScheduleList";

const Main = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: postSchedules } = usePostSchedules();
    const { toast } = useToast();

    const handleCreateSchedule = async (data: PostSchedulesType) => {
        try {
            postSchedules(data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["schedules"] });
                    toast({
                        title: "일정 생성 완료",
                        description: "새로운 일정이 성공적으로 생성되었습니다.",
                    });
                },
                onError: (error) => {
                    toast({
                        title: "일정 생성 실패",
                        description: "일정 생성 중 오류가 발생했습니다.",
                        variant: "destructive",
                    });
                },
            });
        } catch (error) {
            console.error("일정 생성 에러:", error);
            throw error; // 모달에서 에러 처리할 수 있도록 re-throw
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="py-6">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
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

                <ScheduleList />
            </main>
        </div>
    );
};

export default Main;
