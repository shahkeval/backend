import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id:{
        type : String,
        required : true,
        unique : true
    },
    eid:{
        type : String,
        required : true,
    },
    leave_status:{
        type : String,
        required : true,
    },
    reason:{
        type : String,
        required : true,
    },
    dateofleave:{
        type : String,
        required : true,
    }
});

const UserModelLeave = mongoose.model("leave", UserSchema);

export default UserModelLeave;