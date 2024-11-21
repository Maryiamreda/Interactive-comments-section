import axios from "axios";
import { Comment } from '../types/commentTypes';

export const handleScoreChange = async (
    commentId: string,
    comments: Comment[],
    increase: boolean,
    parentId: string | null,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
) => {
    try {
        const apiCommentId = commentId.toString();
        const updatedScore = increase ? 1 : -1;

        const response = await axios.patch(
            `http://localhost:3000/${apiCommentId}${parentId ? `?parentId=${parentId}` : ''}`,
            { scoreChange: updatedScore }
        );

        if (response.status === 200) {
            if (parentId) {
                // Update reply score
                setComments(comments.map(comment => {
                    if (comment._id === parentId) {
                        return {
                            ...comment,
                            replies: comment.replies?.map(reply =>
                                reply.id.toString() === commentId
                                    ? { ...reply, score: reply.score + updatedScore }
                                    : reply
                            ) || []
                        };
                    }
                    return comment;
                }));
            } else {
                // Update main comment score
                setComments(comments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, score: comment.score + updatedScore }
                        : comment
                ));
            }
        }
    } catch (error) {
        console.error('Error updating score:', error);
        // Optionally show an error message to the user
    }
};