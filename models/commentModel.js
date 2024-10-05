
import { Schema, model, models } from 'mongoose';

const commentSchema = new Schema({
    comments: { type: String, required: true }
});

const CommentModel = models.Comment || model('Comment', commentSchema);

export default CommentModel;
