import { QueryClient, dehydrate } from "@tanstack/react-query";
import DndBoard from "@/app/components/DndBoard";
import { getPostsServer } from "@/api/serverApi";
import HydrationWrapper from "@/components/HydrationWrapper";
import { serverQueryClientConfig } from "@/lib/query-config";

export default async function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const scheduleId = Number(id);

    // 서버용 QueryClient 생성 (클라이언트와 완전히 동일한 설정 기반)
    const queryClient = new QueryClient(serverQueryClientConfig);

    // 서버에서 데이터 prefetch (서버 전용 API 사용)
    await queryClient.prefetchQuery({
        queryKey: ["posts", scheduleId],
        queryFn: () => getPostsServer(scheduleId),
    });

    // dehydrate를 사용해서 클라이언트로 전달할 상태 생성
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationWrapper dehydratedState={dehydratedState}>
            <DndBoard scheduleId={scheduleId} />
        </HydrationWrapper>
    );
}
