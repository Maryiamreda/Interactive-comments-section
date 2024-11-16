import mongoose from 'mongoose';

// Define a sub-schema for user details
const userSchema = mongoose.Schema({
    image: {
        png: { type: String, required: true },
        webp: { type: String, required: true },
    },
    username: { type: String, required: true },
});

// Define the main comments schema
const commentsSchema = mongoose.Schema(
    {
        id: { type: Number, required: true },
        content: { type: String, required: [true, "Please enter a comment"] },
        createdAt: { type: String, required: false },
        score: { type: Number, default: 0 },
        user: userSchema, // Reuse the user schema
        replies: [
            {
                id: { type: Number, required: true },
                content: { type: String, required: [true, "Please enter a reply"] },
                createdAt: { type: String, required: false },
                score: { type: Number, default: 0 },
                replyingTo: { type: String, required: false }, // Username being replied to
                user: userSchema,
                replies: [
                    {
                        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for recursive replies
                        ref: 'Comment', // Reference to the Comment model for recursion
                    },
                ], // Recursive replies field (subdocuments)
            },
        ],
    },
    {
        timestamps: true,
        collection: 'comments', // Explicitly match the collection name in your MongoDB
    }
);

const Comments = mongoose.model('Comments', commentsSchema);

export default Comments;
