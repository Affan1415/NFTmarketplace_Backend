const AppError=require("../Utils/appError");
const handleCastErrorDB=err=>{
  const message=`Invalid ${err.path}:${err.value}`;
  //>>400 wrong data
  return new AppError(message,400);

};
const handleDuplicateFieldsBD=(err)=>{
  //>>/(?<=")(?:\\.|[^"\\])*(?=")/ to access the object
  const value=err.errmsg.match(/(?<=")(?:\\.|[^"\\])*(?=")/);
  //${value} to access name of the object

  const message =`Duplicate field values ${value}.Please use another value`;
  return new AppError(message,400);

};
const handleValidationError=(err)=>{
  const errors=Object.values(err.errors).map(el=>el.message);
  const message=`Invalid input Data. ${errors.join(". ")}`;
  return new AppError(message,400);

};
const sendErrorDev=(err,res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error:err,
    stack:err.stack,

});

};
const sendErrorPro=(err,res)=>{
  if(err.isOperational){
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,

});
  }else{
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }

};
const handleJWTError=()=>new AppError("Invalid token,Please log in again",401);
const handelJWTExpiredError=()=>new AppError("Your Token got expire.Please login again",401);
module.exports=(err,req,res,next)=>{
  err.statusCode= err.statusCode || 500;
  err.status=err.status || "error";

  if(process.env.NODE_ENV === "development"){
    sendErrorDev(err,res);

  }else if (process.env.NODE_ENV ==="production"){
    let error={...err};
    if(error.name==="CastError") error=handleCastErrorDB(error);
    if(error.code===11000) error=handleDuplicateFieldsBD(error);
    if(error.name==="ValidationError")error=handleValidationError(error);
    if(error.name==="JsonWebTokenError")error=handleJWTError();
    if(error.name==="TokenExpiredError")error=handelJWTExpiredError();


    sendErrorPro(error,res);
  }
  
next();
};



