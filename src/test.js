import express from 'express';
import mongoose from 'mongoose';
import Comments from './models/commentsModel.js'; // Ensure correct relative path and extension

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(
        'mongodb+srv://jiminshiiii131001:99lxHejzIP3LV2BV@cluster0.wlrky.mongodb.net/Comments?retryWrites=true&w=majority&appName=Cluster0',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Database connection error:', error.message);
    });

// Post Route
app.post('/', async (req, res) => {
    try {
        const comments = await Comments.create(req.body);
        res.status(200).json(comments);
    } catch (error) {
        console.log('Error creating comment:', error.message);
        res.status(500).json({ message: error.message });
    }
});
