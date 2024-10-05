import {Schema,model,models} from 'mongoose'

const registerSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const registerModel=models.registerData||model('registerData',registerSchema)
export default registerModel;