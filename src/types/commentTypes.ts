// types/commentTypes.ts

export interface User {
    username: string;
    image: {
        webp: string;
        png: string;
    };
}

export interface Reply {
    id: string;
    content: string;
    createdAt: string;
    replyingTo: string;
    user: User;
}

export interface Comment {
    _id: string;    // Keep _id for MongoDB documents
    id: number;     // Add id field to match schema
    content: string;
    createdAt: string;
    user: User;
    replies?: Reply[];
}