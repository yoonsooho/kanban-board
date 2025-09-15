"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import { PageLoading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateScheduleModal from "@/app/components/CreateScheduleModal";
import { useGetSchedules, usePostSchedules } from "@/app/hooks/useSchedules";
import { PostSchedulesType } from "@/app/type/postSchedule";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

const DndBoard = dynamic(() => import("@/app/components/DndBoard"), {
    ssr: false,
    loading: () => <PageLoading text="게시판을 로딩중입니다..." />,
});

const Main = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { data: schedules } = useGetSchedules();
    console.log(schedules);
    const { mutate: postSchedules } = usePostSchedules();
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                            <PlusIcon className="h-4 w-4" />새 일정 만들기
                        </Button>
                    </div>
                    {/* <DndBoard /> */}
                </div>

                <CreateScheduleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateSchedule}
                />
                <div>
                    {schedules?.map((schedule: PostSchedulesType) => (
                        <Link
                            href={`main/schedules/${schedule.title}`}
                            key={`${schedule.title}-${schedule.startDate}`}
                            className="block"
                        >
                            <div className="border border-gray-300 p-4 rounded-md hover:bg-gray-100 transition-all duration-300">
                                <h1 className="text-lg font-bold">{schedule.title}</h1>
                                <p className="text-sm text-gray-500">{schedule.startDate}</p>
                                <p className="text-sm text-gray-500">{schedule.endDate}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Main;
