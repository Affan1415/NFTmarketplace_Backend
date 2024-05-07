const AppError=require("../Utils/appError");
const handleCastErrorDB=err=>{
  const message=`Invalid ${err.path}:${err.value}`;
  //>>400 wrong data
  return new AppError(message,400);

};
