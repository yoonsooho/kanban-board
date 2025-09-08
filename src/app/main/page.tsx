"use client";
import dynamic from "next/dynamic";
import React from "react";
import Header from "@/app/components/Header";

const DndBoard = dynamic(() => import("@/app/components/DndBoard"), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen">Loading...</div>,
});

const Main = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="py-6">
                <DndBoard />
            </main>
        </div>
    );
};

export default Main;
