import Userdata from "../Models/User.model.js";
import generatorToken from "../utiles/generateTokenId.js";
import validator from "validator";

const register =async(req,res)=>{
try{
 // check 
    const {firstName,lastName,email,phoneNumber,password,isAdmin}=req.body;

    if (!firstName ||!lastName|| !email || !phoneNumber || !password){
        return res.status(400).json ({message:"missing details"})

        // and so check for one by one validation 
    };
    // os user le input garda space diyeni farak pardhaina
    const name=`${firstName} ${lastName}` // so usermodel ma apply gareko xa 
    //if(!name || name.trim() === ' ')
    if(!name){
        return res.status(400).json({errormessage:"please name fullfill"})
    };
    if(!validator.isMobilePhone(phoneNumber)){
        return res.status(400).json({errormessage:"please enter a valid phone number!"})
    };

    
if (!validator.isEmail(email)) {
    return res.status(400).json({
        errorMessage: "Please enter a valid email"
    });
}

    if(!validator.isStrongPassword(password)){
         return res.status(400).json({errormessage:"please   enter the password min 8 caracters, including uppercase and lowercase and spacial caracters"});

    };
    const number = await Userdata.findOne({ phoneNumber});
    if(number){
        return res.status(400).json({error:"phone number is already exist, please try another!"})
    };
    const user =await Userdata.findOne({email});// check for email find 
    // user is ok 
    if (user){
         return  res.status(400).send({error:"user already registered in email"});
    };

const registerUser= await Userdata.create({firstName,lastName,email,phoneNumber,password,isAdmin});
res.status(201).json({message:"user create in register!",
    user:{
        name:registerUser.name,
        email:registerUser.email,
        phoneNumber:registerUser.phoneNumber,
        password:registerUser.password,
        isAdmin:registerUser.isAdmin

}
});
 const token =generatorToken(registerUser._id,res);
}
   
    catch(err){
        res.status(404).json({error:err.message});
    }
}

// login system 

const login =async(req,res)=>{
try{

  const { phoneNumber,email,password}=req.body;

    if (!email || !password){
        return res.status(400).json({message:"email and password are required!"})
    }

    // const number = await Userdata.findOne({phoneNumber});
    // if(!number){
    //     return res.status(400).json({error:"phone number is not found, please register first!"})
    // }
    const user =await Userdata.findOne({email});

        if (!user){
            return res.status(400).json( {error:"user is not found!,please register first"});
        };
      // not change for hashing password in plain text 
    // password compare in hashing to hashing password
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {

         return res.status(400).json({error:"password is incorrect, please try again!"});
    };

// token generator
 const token =generatorToken(user._id,res);
 
    res.status(201).json({
        message:"you are login succcessfully!",
        user:{
           name:user.name,
           phoneNumber:user.phoneNumber,
          email:user.email,
          isAdmin:user.isAdmin,
        }
        
    });
}
  catch(err){
     res.status(404).json({error:err.message});
}

  
   
}

const logout= async (req,res)=>{
try{

res.clearCookie('jwtcookies',{
    httpOnly :true,
})
res.json({message:"you are logout"});

}
catch(err){
    res.status(500).json({error:err.message});

}
}

// get profile 
const getprofile = async(req,res)=>{
     try{
        const user = req.user;
        if(!user)return res.status(404).send({error:"you are not login"});
        res.status(200).json({message:"your profile",user});


    }
    catch(err){
    res.status(500).json({error:err.message});
}
};

// and update profile 

const updateprofile = async(req,res)=>
{
    try{
        const {firstName , lastName , email , phoneNumber, password}= req.body;
        const userId = req.user._id;
        const  userupdate = await Userdata.findById(userId);
        if(!userupdate) return res.status(404).json({error:"user not found!"});
        // update in user 

        userupdate.firstName = firstName || userupdate.firstName;
        userupdate.lastName = lastName || userupdate.lastName;
        userupdate.phoneNumber = phoneNumber || userupdate.phoneNumber;
        userupdate.email = email || userupdate.email;

        if (password){
       userupdate.password = password
        }
        await userupdate.save();

        res.send({message:"user updated sucess"});


    }
      catch(err){
    res.status(500).json({error:err.message});
}
}



export {register,login,logout,getprofile , updateprofile};
