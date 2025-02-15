import { Items } from "@/app/type/item";
// 보드나 아이템의 위치를 찾는 헬퍼 함수들
export const helpers = (items: Items) => ({
    isMoveBoard: (id: string) => items.some((board) => board.title === id),
    findBoard: (id: string) => items.findIndex((board) => board.items.some((item) => item.id === id)),
    getBoardItems: (index: number) => items[index]?.items || [],
});
