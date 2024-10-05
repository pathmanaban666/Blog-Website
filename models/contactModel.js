import { Schema,model,models } from "mongoose";
const contactSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})
const contactModel=models.contact||model("contact",contactSchema);
export default contactModel;