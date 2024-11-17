export interface User {
    username: string;
    image: {
        png: string;
        webp: string;
    };
}

export interface Reply {
    id: number;
    content: string;
    createdAt: string;
    replyingTo: string;
    user: User;
}

export interface Comment {
    isReplying: any;
    _id: string;
    content: string;
    score: string;
    createdAt: string;
    user: User;
    replies: Reply[];
}
