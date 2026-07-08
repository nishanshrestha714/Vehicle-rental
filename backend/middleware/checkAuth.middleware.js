//  import jwt from 'jsonwebtoken';
//  import Userdata from '../Models/User.model.js';

//  const checkAuth =(req,res)=>{

//     const token =req.cookies.jwt
//     if (!token){
//         return res.status(401).json({error:"you are mot login !"});

//     }

//     try{
//         const {_id} = jwt.verify(token , process.env.JWT_SECRET_KEY);
//         const user = Userdata.findById(_id);

//         req.user={
//         _id:user._id,
//         name:user.name,
//         email:user.email,
//         isAdmin:user.isAdmin
//         }
//         next();


//     }
//     catch(err){
//         res.status(400).json({error:err.message});
//     }
//  }

//  export default checkAuth;



 import jwtcookies from 'jsonwebtoken';

 import Userdata from '../Models/User.model.js';

 const checkAuth =async (req,res,next)=>{

    const token = req.cookies.jwtcookies;
    if(!token){
        return res.status(401).send({error:"you are not login!"});
    }
    // token verify
    try{

        const {_id} = jwtcookies.verify(token , process.env.JWT_SECRET_KEY);
        const user =  await Userdata.findById(_id);
        req.user={
            _id:user._id,
            name:user.name,
            email:user.email,
              phoneNumber: user.phoneNumber,
            isAdmin:user.isAdmin
        }
        next();
    }
    catch(err){
        res.status(400).json({error:err.message})
    }
 }

 export default checkAuth;

