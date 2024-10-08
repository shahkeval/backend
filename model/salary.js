import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id:{
        type : String,
        required : true,
        unique : true
    },
    s_eid:{
        type : String,
        required : true,
    },
    g_sal:{
        type : Number,
        required : true,
    },
    t_sal:{
        type : Number,
        required : true,
    },
    sal_amt:{
        type : Number,
        required : true,
    }
    
});

const UserModelSalary = mongoose.model("Salary", UserSchema);

export default UserModelSalary;