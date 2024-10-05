
import { Schema, model, models,Types } from 'mongoose';

const commentSchema = new Schema({
    id: {
        type:Types.ObjectId,
        required: true
    },
    postId: {
        type:Types.ObjectId,
        required: true
    },
    username:{
        type: String, required: true
    },
    comment: { 
        type: String, required: true 
    }, 
    createdAt: {
         type: Date, default: Date.now
         }
});

const CommentId = models.CommentId || model('CommentId', commentSchema);

export default CommentId;