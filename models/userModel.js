const crypto=require("crypto");
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
    passwordResetToken: String,
    passwordResetExpires:Date,
    active:{
        type: Boolean,
        default:true,
        select:false,
    },

});
//middleware to save the passwords
userSchema.pre("save",function(next){
    //once the password is changed afte rthat token is created
    if(!this.isModified("password")|| this.isNew)return next();

    this.passwordChangedAt=Date.now()-1000;
    next();
});
//global find to find the accounts that aint deleted
userSchema.pre(/^find/,function(next){
    this.find({active :{$ne:false}});
    next();
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

userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString("hex");

    this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    //10 min
    console.log({resetToken},this.passwordResetToken);
    this.passwordResetExpires=Date.now()+10*60*1000;

    return resetToken;
};
const User=mongoose.model("User",userSchema);
module.exports=User;