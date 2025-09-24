export type boards = {
    id: number;
    title: string;
    seq: number;
    contentItems: { id: number; text: string }[];
}[];
