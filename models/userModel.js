const mongoose=require("mongoose");
const validator = require("validator");
const bcrypt=require("bcryptjs");
const userSchema=new mongoose.Schema({
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
        validate:{
            //this work on save and not on find ,findone
            validator:function(el){
                return el ==this.password //true
            },
            message:"Password is not the same",
        },

    },

});

userSchema.pre("save",async function(next){
    //password modified
    if(!this.isModified("password"))return next();
    //>>encrypt password hash password 12
    this.password=await bcrypt.hash(this.password,12);
    //>>de;ete confirm password form db
    this.passwordConfirm=undefined;
    next();
});
//>.build scehma
const User=mongoose.model("User",userSchema);
module.exports=User;