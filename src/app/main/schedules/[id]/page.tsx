import React from "react";
import DndBoard from "@/app/components/DndBoard";

export default function SchedulePage({ params }: { params: { id: string } }) {
    const { id } = params;
    console.log(id);
    return (
        <div>
            <DndBoard />
        </div>
    );
}
