import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        unique : true,
        required : true
    },
    email:{
        type:String,
        required : true,
        unique : true,
        lowercase : true
    },
    password :{
        type: String,
        required: true,
        minlength: 6
    }
},{timestamps:true});

export const Register = mongoose.model("Register",userSchema)