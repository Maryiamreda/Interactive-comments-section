import axios from "axios";
import { Comment } from '../types/commentTypes';



export const handleScoreChange = async (
    commentId: string,
    comments: Comment[],
    increase: boolean,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
) => {
    try {
        const apiCommentId = commentId.toString();

        // Prepare data to update
        const updatedScore = increase ? 1 : -1; // Use increase or decrease for score change
        const response = await axios.patch(
            `http://localhost:3000/${apiCommentId}`, // API endpoint
            { scoreChange: updatedScore } // Sending score change data
        );

        if (response.status === 200) {
            setComments(comments.map(comment =>
                comment._id === apiCommentId
                    ? { ...comment, score: comment.score + updatedScore }
                    : comment
            ));
        }
    } catch (error) {
        console.error('Error updating score:', error);
        // Optionally show an error message to the user
    }
};
