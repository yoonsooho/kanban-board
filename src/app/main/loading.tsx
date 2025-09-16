import { PageLoading } from "@/components/ui/loading";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <PageLoading text="일정을 로딩중입니다..." />
        </div>
    );
}
