export interface DndHelpers {
    isSomeBoard: (id: string) => boolean;
    findBoardIdx: (itemId: string) => number;
    getBoardItems: (boardIndex: number) => { id: string; name: string }[];
}
