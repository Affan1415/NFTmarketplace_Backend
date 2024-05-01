const jwt=require("jsonwebtoken");
const User=require("./../models/userModel");
const catchAsync=require("../Utils/catchAsync");
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
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
        status:"Success",
        token,
        data:{
            user:newUser,
        },
    });
});