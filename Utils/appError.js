//>>creating our error handel model work for every api coming
class AppError extends Error{
    constructor(message,statusCode){
        //>.super acessing parent class meaage
        super(message);

        this.statusCode=statusCode;
        this.status=`${statusCode}`.startsWith("4")?"fail":"error";
        //>>else proraming error
        this.isOperational=true;

        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports=AppError;