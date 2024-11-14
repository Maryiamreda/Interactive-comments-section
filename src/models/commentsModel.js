import mongoose from 'mongoose';

const commentsSchema = mongoose.Schema(
    {
        id: { type: Number, required: true },
        content: { type: String, required: [true, "Please enter a comment"] },
        createdAt: { type: String, required: false },
        score: { type: Number, default: 0 },
        user: {
            image: {
                png: { type: String, required: true },
                webp: { type: String, required: true },
            },
            username: { type: String, required: true },
        },
        replies: [
            {
                id: { type: Number, required: true },
                content: { type: String, required: [true, "Please enter a reply"] },
                createdAt: { type: String, required: false },
                score: { type: Number, default: 0 },
                replyingTo: { type: String, required: true },
                user: {
                    image: {
                        png: { type: String, required: true },
                        webp: { type: String, required: true },
                    },
                    username: { type: String, required: true },
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Comments = mongoose.model('Comments', commentsSchema);
export default Comments;  // Changed to ES Module export