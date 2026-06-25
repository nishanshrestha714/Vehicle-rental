import fs from 'fs';
import path from 'path';
const logger =(req,res,next)=>{

    const today = new Date();// current date provide 
    const timpstamp =(`${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}   ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}s`);
    const start =Date.now();
    res.on("finish",()=>{
        const end =Date.now();

        const mgs =(`${timpstamp} :: ${req.method}on ${req.originalUrl}   ${res.statusCode}  ${end-start}ms`);

        // in save in file this detail in midleware 
        fs.appendFile(path.join(path.resolve(), '..app.log'),mgs+"\n",(error)=>{
            if (error)
            {
                 console.log('waiting is log',error.message);
            }

        })
        console.log(mgs);
    });
    next(); 

}


export default logger;