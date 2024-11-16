import express from 'express';
import mongoose from 'mongoose';
import Comments from './models/commentsModel.js';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(
        'mongodb+srv://jiminshiiii131001:99lxHejzIP3LV2BV@cluster0.wlrky.mongodb.net/Comments?retryWrites=true&w=majority&appName=Cluster0',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
        console.log('Connected to MongoDB');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        const count = await Comments.countDocuments();
        console.log(`Current number of comments: ${count}`);

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

// GET all comments
app.get('/', async (req, res) => {
    try {
        const comments = await Comments.find({}).lean();
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST new comment
app.post('/', async (req, res) => {
    try {
        const comment = await Comments.create(req.body);
        res.status(200).json(comment);
    } catch (error) {
        console.log('Error creating comment:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// PUT (update) comment
app.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comments.findByIdAndUpdate(id, req.body);
        if (!comment) {
            return res.status(404).json({ message: `cannot find any comment with ID ${id}` });
        }
        const updatedComment = await Comments.findById(id);
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE comment
app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comments.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ message: `cannot find any comment with ID ${id}` });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default app;