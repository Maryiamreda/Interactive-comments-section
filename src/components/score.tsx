import axios from "axios";
import { Comment } from "../types/commentTypes";

export const handleScoreChange = async (
    commentId: string,
    increase: boolean,
    parentId: string | null,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
    refreshComments: () => Promise<void> // Add the refreshComments function as a parameter

) => {
    try {
        const updatedScore = increase ? 1 : -1;
        const action = increase ? "like" : "dislike";

        const response = await axios.patch(
            `http://localhost:3000/${commentId}${parentId ? `?parentId=${parentId}` : ""}`,
            { scoreChange: updatedScore, action }
        );

        if (response.status === 200) {
            setComments(prevComments =>
                prevComments.map(comment => {
                    if (parentId && comment._id === parentId) {
                        return {
                            ...comment,
                            replies: comment.replies?.map(reply =>
                                reply.id.toString() === commentId
                                    ? { ...reply, score: reply.score + updatedScore }
                                    : reply
                            ),
                        };
                    } else if (!parentId && comment._id === commentId) {
                        return { ...comment, score: comment.score + updatedScore };
                    }
                    return comment;
                })
            );
            await refreshComments();

        }
    } catch (error) {
        console.error("Error updating score:", error);
    }
};
