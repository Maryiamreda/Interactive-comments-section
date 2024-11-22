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
        commentActions: {

            action: { type: String, enum: ['like', 'dislike'], required: true }

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
                commentActions: {
                    action: { type: String, enum: ['like', 'dislike'], required: true }

                },
            },
        ],
    },
    {
        timestamps: true,
        // This ensures the collection name exactly matches what's in MongoDB
        collection: 'comments'  // This is important - it matches the green collection name in your UI
    }
);

const Comments = mongoose.model('Comments', commentsSchema);
export default Comments;