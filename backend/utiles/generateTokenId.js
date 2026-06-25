
import jwt from 'jsonwebtoken'

// so fnction 
const generatorToken =(_id,res)=>{
    // { userId: user._id },
const token =jwt.sign({_id}, process.env.JWT_SECRET_KEY ,{expiresIn:"4d"})//4 day before expire
res.cookie('jwtcookies',token,{
     httpOnly: true, 
     maxAge:4*24*60*60*1000,
})
}

export default generatorToken;
  