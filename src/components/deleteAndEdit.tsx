import axios from 'axios';
import { Comment } from '../types/commentTypes';

export const handleDelete = async (
    commentId: string,
    comments: Comment[],
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
) => {
    try {
        const response = await axios.delete(`http://localhost:3000/${commentId}`);
        const deletedComment: Comment = response.data;

        // Filter out the deleted comment from the state
        setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
};
