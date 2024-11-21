import { Reply, Comment } from '../types/commentTypes';

export const handleReplySubmit = async (
    commentId: string,
    replyContent: string,
    replyto: string,
    comments: Comment[],
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
    setReplyContent: React.Dispatch<React.SetStateAction<string>>,
    setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>
) => {
    if (!replyContent.trim()) {
        alert('Reply content cannot be empty.');
        return;
    }

    const comment = comments.find((c) => c._id === commentId); //how to search also in replys 
    if (!comment) {
        alert('Comment not found.');
        return;
    }

    const replyData: Reply = {
        id: Date.now().toString(), // Make sure to use 'id' only for replies, as it's part of the schema.
        content: replyContent.replace(`@${comment.user.username} `, ''), // Removes username mention
        replyingTo: replyto,
        createdAt: new Date().toISOString(),
        user: {
            username: 'juliusomo',
            image: {
                webp: './images/avatars/image-juliusomo.webp',
                png: './images/avatars/image-juliusomo.png',
            },
        },
    };

    try {
        const response = await fetch(`http://localhost:3000/comments/${commentId}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(replyData),
        });

        if (!response.ok) {
            throw new Error('Failed to send reply');
        }

        const updatedComment = await response.json(); // Get the updated comment with the new reply
        setComments((prev) =>
            prev.map((c) => (c._id === commentId ? updatedComment : c))
        );
        setReplyContent(''); // Clear the reply input
        setReplyingTo(null); // Exit replying mode
    } catch (error) {
        console.error('Error adding reply:', error);
        alert('Failed to add reply. Please try again.');
    }
};
