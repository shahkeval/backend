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
    email:{
        type : String,
        required : true,
    },
    password:{
        type : String,
        required : true,
    }
});

const UserModelAdmin = mongoose.model("admin", UserSchema);

export default UserModelAdmin;