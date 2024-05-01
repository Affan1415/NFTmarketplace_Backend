const User=require("./../models/userModel");
const catchAsync=require("../Utils/catchAsync");
//Signup
exports.signup=catchAsync(async(req,res,next)=>{
    //this way anonw crete the acc will become admin
    //const newUser=await User.create(req.body);
    const newUser= await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,

    });
    res.status(201).json({
        status:"Success",
        data:{
            user:newUser,
        },
    });
});