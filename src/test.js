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

app.post('/comments', async (req, res) => {
    try {
        const comment = await Comments.create(req.body);
        console.log('Incoming Data:', req.body); // Log the data received

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/comments/:commentId/reply', async (req, res) => {
    try {
        const comment = await Comments.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.replies.push(req.body);
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT (update) comment

// app.put('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const comment = await Comments.findByIdAndUpdate(id, req.body);
//         if (!comment) {
//             return res.status(404).json({ message: `cannot find any comment with ID ${id}` });
//         }
//         const updatedComment = await Comments.findById(id);
//         res.status(200).json(updatedComment);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// app.put('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { parentId } = req.query;

//         if (parentId === id) {
//             const comment = await Comments.findByIdAndUpdate(id, req.body);
//             if (!comment) {
//                 return res.status(404).json({ message: `cannot find any comment with ID ${id}` });
//             }
//             return res.status(200).json({ message: 'Comment updated successfully' });
//         }

//         // Delete reply 
//         const parentComment = await Comments.findById(parentId);
//         if (!parentComment) {
//             return res.status(404).json({ message: `Cannot find parent comment with ID ${parentId}` });
//         }

//         // Filter out the reply - id is already a number 
//         parentComment.replies.forEach(
//             (reply) => {
//                 if (reply.id === parseInt(id)) {
//                     findByIdAndUpdate(reply.id, req.body);
//                     return
//                 }
//             }
//         );

//         await parentComment.save();
//         res.status(200).json({ message: 'Reply updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });










app.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { parentId } = req.query;
        const { content } = req.body;
        console.log(content)
        if (parentId === id) {
            const comment = await Comments.findByIdAndUpdate(id, { content });
            if (!comment) {
                return res.status(404).json({ message: `cannot find any comment with ID ${id}` });
            }
            return res.status(200).json({ message: 'Comment updated successfully' });
        }

        // Update reply 
        const parentComment = await Comments.findById(parentId);
        if (!parentComment) {
            return res.status(404).json({ message: `Cannot find parent comment with ID ${parentId}` });
        }

        // Update the reply - id is already a number 
        parentComment.replies.forEach(
            (reply) => {
                if (reply.id === parseInt(id)) {
                    reply.content = content;
                    return;
                }
            }
        );

        await parentComment.save();
        res.status(200).json({ message: 'Reply updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//score system








app.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params; // This is the custom `id` field
        const { parentId } = req.query; // Parent ID for replies
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Update main comment
        if (!parentId || parentId === id) {
            const comment = await Comments.findOneAndUpdate(
                { id: id }, // Find by custom `id` field
                { content }, // Update the content field
                { new: true } // Return the updated document
            );

            if (!comment) {
                return res.status(404).json({ message: `Cannot find any comment with ID ${id}` });
            }

            return res.status(200).json({ message: 'Comment updated successfully', comment });
        }

        // Update reply
        const parentComment = await Comments.findOne({ id: parentId }); // Find parent by custom `id`
        if (!parentComment) {
            return res.status(404).json({ message: `Cannot find parent comment with ID ${parentId}` });
        }

        // Locate and update the reply
        const reply = parentComment.replies.find(reply => reply.id === parseInt(id));
        if (!reply) {
            return res.status(404).json({ message: `Cannot find reply with ID ${id}` });
        }

        reply.content = content; // Update the content of the reply

        await parentComment.save();
        return res.status(200).json({ message: 'Reply updated successfully', reply });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Updated backend delete route
app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { parentId } = req.query;

        if (parentId === id) {
            // Delete main comment
            console.log(id)
            const deletedComment = await Comments.findByIdAndDelete(id);
            if (!deletedComment) {
                return res.status(404).json({ message: `Cannot find comment with ID ${id}` });
            }
            return res.status(200).json({ message: 'Comment deleted successfully' });
        }

        // Delete reply
        const parentComment = await Comments.findById(parentId);
        if (!parentComment) {
            return res.status(404).json({ message: `Cannot find parent comment with ID ${parentId}` });
        }

        // Filter out the reply - id is already a number
        parentComment.replies = parentComment.replies.filter(
            (reply) => reply.id !== parseInt(id)
        );

        await parentComment.save();
        res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// app.delete('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const comment = await Comments.findByIdAndDelete(id);
//         if (!comment) {
//             return res.status(404).json({ message: `cannot find any comment with ID ${id}` });
//         }
//         res.status(200).json(comment);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });



export default app;