import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id:{
        type : String,
        required : true,
        unique : true
    },
    name:{
        type : String,
        required : true,
    },
    gender:{
        type : String,
        required : true,
    },
    age:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
    },
    doj:{
        type : String,
        required : true,
    },
    password:{
        type : String,
        required : true,
    }
});

const UserModelEmp = mongoose.model("employee", UserSchema);

export default UserModelEmp;