import { Comment } from '../types/commentTypes';
import { formatDistanceToNow } from 'date-fns';

export const newComment = async (
    commentContent: string,
    comments: Comment[],
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
    setCommentContent: React.Dispatch<React.SetStateAction<string>>,
) => {
    if (!commentContent.trim()) {
        alert('Comment cannot be empty.');
        return;
    }

    const commentData = {
        id: Date.now(), // Added back as it's required in your schema

        content: commentContent,
        createdAt: formatDistanceToNow(new Date(), { addSuffix: true }), // Simple usage of date-fns
        score: 0,
        user: {
            username: 'juliusomo',
            image: {
                webp: './images/avatars/image-juliusomo.webp',
                png: './images/avatars/image-juliusomo.png',
            },
        },
        replies: []
    };

    try {
        const response = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData),
        });

        if (!response.ok) {
            throw new Error('Failed to send reply');
        }

        const newComment = await response.json(); // This will include the _id from MongoDB
        setComments([...comments, newComment]);
        setCommentContent('');
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
    }
};