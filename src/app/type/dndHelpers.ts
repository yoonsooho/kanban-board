export interface DndHelpers {
    isSomeBoard: (id: number) => boolean;
    findBoardIdx: (itemId: number) => number;
    getBoardItems: (boardIndex: number) => { id: number; name: string }[];
}
