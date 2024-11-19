import axios from 'axios';
import { Comment } from '../types/commentTypes';


export const handleDelete = async (
    commentId: string,
    comments: Comment[],
    parentId: string | null,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
) => {
    try {
        // Convert reply ID to string if it's a number
        const apiCommentId = commentId.toString();

        const response = await axios.delete(
            `http://localhost:3000/${apiCommentId}${parentId ? `?parentId=${parentId}` : ''}`
        );

        if (response.status === 200) {
            if (parentId) {
                // Handling reply deletion
                setComments(comments.map(comment => {
                    if (comment._id === parentId) {
                        return {
                            ...comment,
                            replies: comment.replies?.filter(reply =>
                                reply.id.toString() !== commentId
                            ) || []
                        };
                    }
                    return comment;
                }));
            } else {
                // Handling main comment deletion
                setComments(comments.filter(comment => comment._id !== commentId));
            }
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        // You might want to show an error message to the user here
    }
};

export const handleEdit = async (
    commentId: string,
    comments: Comment[],
    content: string,
    parentId: string | null,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
) => {
    try {
        // Convert reply ID to string if it's a number
        const apiCommentId = commentId.toString();

        const response = await axios.put(
            `http://localhost:3000/${apiCommentId}${parentId ? `?parentId=${parentId}` : ''}`,
            { content } // Send the content in the request body
        );

        if (response.status === 200) {
            if (parentId) {
                // Handling reply edit
                setComments(comments.map(comment => {
                    if (comment._id === parentId) {
                        return {
                            ...comment,
                            replies: comment.replies?.map(reply =>
                                reply.id.toString() === commentId
                                    ? { ...reply, content }
                                    : reply
                            ) || []
                        };
                    }
                    return comment;
                }));
            } else {
                // Handling main comment edit
                setComments(comments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, content }
                        : comment
                ));
            }
        }
    } catch (error) {
        console.error('Error editing comment:', error);
        // Optionally show an error message to the user
    }
};