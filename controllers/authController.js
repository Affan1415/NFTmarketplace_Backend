const jwt=require("jsonwebtoken");
const User=require("./../models/userModel");
const catchAsync=require("../Utils/catchAsync");
const AppError=require("./../Utils/appError");
//create token reuseable
const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
//Signup
exports.signup=catchAsync(async(req,res,next)=>{
    //this way anonw crete the acc will become admin
    //const newUser=await User.create(req.body);
    //created the acc
    const newUser= await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,

    });
    //straight login so creste the token
    const token=signToken(newUser._id);

    res.status(201).json({
        status:"Success",
        token,
        data:{
            user:newUser,
        },
    });
});
//login user
exports.login=catchAsync(async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return next(new AppError("Please provide ypur email & password"));
    }

    const user=await User.findOne({email}).select("+password");
    //console.log(user);
    //>>if password match or not
    if(!user||!(await user.correctPassword(password,user.password))){
        return next(new AppError("Incorrect email and password",401));
    }
    //>>we have to send the token back cuz its imp for login and logpout

    const token=signToken(user.id);
    res.status(200).json({
        status:"sucess",
        token,
    });
});