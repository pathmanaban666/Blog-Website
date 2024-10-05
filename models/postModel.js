import {Schema,model,models} from "mongoose";
const schema=new Schema({
    // title:String,
    // Details:String,
    // image:String,
    title:{
        type:String,
        required:true
    },
    Details:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    date: {
        type: String, 
        required:true
        }
},{toJSON:{virtuals:true}});
schema.virtual('short').get(function(){
    return this.Details.substr(0,130) + '.......'
})
const postModel=models.Post || model("Post",schema);
export default postModel;