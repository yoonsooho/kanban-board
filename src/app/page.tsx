import dynamic from "next/dynamic";

const DndBoard = dynamic(() => import("./components/DndBoard"), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen">Loading...</div>,
});

// 페이지 컴포넌트
export default function Home() {
    return (
        <>
            <DndBoard />
        </>
    );
}
