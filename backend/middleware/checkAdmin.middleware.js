const checkAdmin = async (req,res,next)=>{
   try{
 const isAdmin = req.user.isAdmin;
    if (!isAdmin){
        return res.status(403).json({error:"you are not autorized the perform  this operation "})
    }
    next();
   }
   catch(err){
    res.status(400).json({error:"token failed",error:err.message})
   }
   
}
export default checkAdmin;
