import { boards } from "@/app/type/item";
// 보드나 아이템의 위치를 찾는 헬퍼 함수들
export const helpers = (items: boards) => ({
    isSomeBoard: (id: string) => items.some((board) => board.title === id),
    findBoardIdx: (itemId: string) => items.findIndex((board) => board.items.some((item) => item.id === itemId)),
    getBoardItems: (boardIndex: number) => items[boardIndex]?.items || [],
});
