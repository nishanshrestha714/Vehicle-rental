import ContactMessage from "../Models/contact.message.js";
const sendMessage = async(req,res)=>{
    try{
        const {name,email,phoneNumber,message}= req.body;

        // Validate required fields
        if(!name || !email || !phoneNumber || !message){
            return  res.status(400).send({error:"All fields are required"});
        }
        const addMessage = ContactMessage.create({
            name,
            email,
            phoneNumber,
            message
        });

        res.status(201).send({message:"message sent successfully"});


    }
    catch(err){
        res.status(500).send({error:err.message});
    }
}

// and get all message in admin  

const getAllMessage= async(req,res)=>{
    try{
          const messages = await ContactMessage.find().populate("user","firstName lastName phoneNumber  email");
    if(!messages){
        return res.status(404).json({error:"message not found "})
    };

     res.status(200).send({message:"messages all show sucessfully",messages})
    }
    catch(err){
        res.status(500).send({error:err.message})
    }
  
};
//  and delet message in  is admin 
const deleteMessage= async(req,res)=>{
    try{
        const {id}= req.params;

        const deletemessage  = await ContactMessage.findByIdAndDelete(id);
        if(!deletemessage){
            return res.status(404).send({error:"message is not found"});
        }
        res.status(200).send({message:"message is deleted successfully"})

         
    }
    catch(err){
        res.status(500).send({error:err.message})
    }
}

export {sendMessage,getAllMessage , deleteMessage} ;