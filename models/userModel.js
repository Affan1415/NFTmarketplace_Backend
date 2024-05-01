const mongoose=require("mongoose");
const validator = require("validator");

const userSchema=new mongoose({
    name:{
        type:String,
        required:[true,"please tell us your name"],
    },
    email:{
        type: String,
        required:[true,"Please provide your email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"please provide a valid email address"],
    },
    photo:String,
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength:8,
    },
    passwordConfirm:{
        type:String,
        required:[true,"please comfirm your password"],

    },

});
//>.build scehma
const user=mongoose.model("User",userSchema);
module.exports=User;