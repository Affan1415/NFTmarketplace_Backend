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
