export type contentItems = {
    text: string;
    id: number;
    seq: number;
};

export type postContentItemsType = {
    text: string;
    post_id: number;
};
export type patchContentItemsType = {
    text: string;
};

export type moveContentItems = {
    contentItemId: number;
    fromPostId: string;
    toPostId: string;
    toPostContentItems: Omit<contentItems, "text">[];
};
