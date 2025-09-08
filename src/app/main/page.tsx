"use client";
import dynamic from "next/dynamic";
import React from "react";

const DndBoard = dynamic(() => import("@/app/components/DndBoard"), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen">Loading...</div>,
});

const Main = () => {
    return (
        <div>
            <DndBoard />
        </div>
    );
};

export default Main;
