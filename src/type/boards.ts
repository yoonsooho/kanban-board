export type board = {
    id: number;
    title: string;
    seq: number;
    contentItems: { id: number; text: string }[];
};

export type boards = board[];
