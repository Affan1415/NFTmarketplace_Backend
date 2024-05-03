const crypto=require("crypto");
const {promisify}=require("util");
const jwt=require("jsonwebtoken");
const User=require("./../models/userModel");
const catchAsync=require("../Utils/catchAsync");
const AppError=require("./../Utils/appError");
const sendEmail=require("../Utils/email");
//create token reuseable
const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
//creating the cookie
const createSendToken=(user,statusCode,res)=>{
    const token=signToken(user._id);
    const cookieOptions={
        espires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIR_IN*24*60*60*1000),
        //secure:true,
        httpOnly:true,
        
    };
    //if((process.env.NODE_ENV="production"))cookieOptions.secure=true;
    res.cookie("jwt",token,cookieOptions);
    user.password=undefined;

    res.status(statusCode).json({
        status:"Success",
        token,
        data:{
            user,
        },
    });
};
//Signup
exports.signup=catchAsync(async(req,res,next)=>{
    //this way anonw crete the acc will become admin
    const newUser=await User.create(req.body);
    //created the acc
    // const newUser= await User.create({
    //     name: req.body.name,
    //     email:req.body.email,
    //     password:req.body.password,
    //     passwordConfirm:req.body.passwordConfirm,

    // });
    //straight login so creste the token
    createSendToken(newUser,201,res);
    // const token=signToken(newUser._id);

    // res.status(201).json({
    //     status:"Success",
    //     token,
    //     data:{
    //         user:newUser,
    //     },
    // });
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
    createSendToken(user,200,res);

    // const token=signToken(user.id);
    // res.status(200).json({
    //     status:"sucess",
    //     token,
    // });
});

//protecting data (keeping track if its login or logout)
exports.protect=catchAsync(async(req,res,next)=>{
    //1 check token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
        
    }
    if(!token){
        return next(new AppError("You are not logged in to get acces",401));
    }
    //console.log(token);
    //2 validate taken
    const decoded=await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);
    //3 user exist(if the user delete the acc detelete the token as well)
    const currentUser=await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError("The User belonging to this token no longer exist",401));
    }
    //4 change password(if password get change then the token change ass well)
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError("User recently changed the password",401));
    }
    //user will have access to protected data
    req.user=currentUser;
    next();

});

exports.restrictTo=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new AppError("You have not access to delete the NFT",403)
            );

        }
        next();
    };
};

//Now we going to work on
//--forgot password
exports.forgotPassowrd=catchAsync(async(req,res,next)=>{
    //1 get the user based on the given email
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new AppError("there is no user with this email",404));
    }

    //2 create a random token (to validate user is real or not)
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

    //3 send email back to the user
    const resetURL=`${req.protocol}://${req.get("host")}/api/v1/users/resetPassowrd/${resetToken}`;

    const message=`Forget your password Submit a PATCH request with your new password and confirm password to:${resetURL}.\n if didnt forget your password please ignore this email`;
    try{
        await sendEmail({
            email:user.email,
            subject:"Your Password token (valid for 10 min",
            message,
        });
        res.status(200).json({
            status:"success",
            message:"token sent to email",
        });
    }catch(error){
        user.passwordResetToken = undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});

        return next(new AppError("there was an error sending the email,try again later",500));
    }

    
});

//--reset password
exports.resetPassowrd=async(req,res,next)=>{
    //get the user based on the token
    const hashedToken= crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user=await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt:Date.now()},
    });
    //if token has not expired and there is user set the new password 
    if(!user){
        return next(new AppError("Token is invalid or has expired",400));
    }
    //update changed password for the user

    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
//log the user in,send jwt
    createSendToken(user,200,res);
    // const token=signToken(user.id);
    // res.status(200).json({
    //     status:"sucess",
    //     token,
    // });
};

//--update password
exports.updatePassword=catchAsync(async(req,res,next)=>{
    //get the user from the collection of data
    const user=await User.findById(req.user.id).select("+password");
    //check if the posted cureent password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
        return next(new AppError("Your current password is wrong",401));
    }
    //if so update te password
    user.password =req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
    //log user after the password changed
    createSendToken(user,200,res);
    
});