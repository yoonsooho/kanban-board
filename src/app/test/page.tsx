"use client";
import dynamic from "next/dynamic";
import React from "react";
import Header from "@/app/components/Header";
import { PageLoading } from "@/components/ui/loading";

const DndBoard = dynamic(() => import("@/app/components/DndBoard"), {
    ssr: false,
    loading: () => <PageLoading text="게시판을 로딩중입니다..." />,
});

const Main = () => {
    return <div className="min-h-screen bg-gray-50">test</div>;
};

export default Main;
