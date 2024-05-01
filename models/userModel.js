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
    role:{
        type: String,
        enum:["user","creator","admin","guide"],
        default:"user",
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength:8,
        select:false,
    },
    passwordConfirm:{
        type:String,
        required:[true,"please comfirm your password"],
        validate:{
            //this work on save and not on find ,findone
            validator:function(el){
                return el === this.password //true
            },
            message:"Password is not the same",
        },

    },
    passwordChnagedAt: Date,

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
//if true passowrd match otherwise not
userSchema.methods.correctPassword=function(
    candidatePassword,
    userPassword
){
    return bcrypt.compare(candidatePassword,userPassword);
};
userSchema.methods.changedPasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        //converting time in sec
        const changedTimeStamp= parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp<changedTimeStamp;

        console.log(changedTimeStamp,JWTTimestamp);
    }
    //return false by default
    return false;
};
//>.build scehma
const User=mongoose.model("User",userSchema);
module.exports=User;