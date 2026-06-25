const notfound = (req,res)=>{
    const error = new Error(`${req.method} on ${req.originalUrl} -- invalied Url`)
    res.status(404);
    next(error);

}

const errorhandler = (error,req,res,next)=>{
    const statusCode = res.statusCode == 200 ?500 :res.statusCode;
    let err = error.message || "internal server error"

    res.status(statusCode).json({error:err});
};

export {notfound,errorhandler};
