export type Item = {
    id: string;
    name: string;
};

export type boards = {
    title: string;
    items: Item[];
}[];
