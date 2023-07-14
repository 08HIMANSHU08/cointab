const User = require('../models/user');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');

function isStringEmpty(str){
    if(str==undefined||str.length==0){
        return true;
    }else{
        return false;
    }
}
exports.postLogin = async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const {email,password}= req.body;
        if(isStringEmpty(email)||isStringEmpty(password)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const user = await User.findAll({where:{email}},{transaction:t});
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    throw new Error("Something Went Wrong");
                }
                if(result===true){
                    if(user[0].wrongpasswordentered==5){
                        res.status(404).json({success:false,message:"You Are Blocked, Try After 24 Hours"})
                    }else{
                        User.update({wrongpasswordentered:0},{where:{id:user[0].id}})
                        res.status(200).json({success:true,message:"Login Successfull",user:user[0].email});
                    }                   
                }else{
                    if(user[0].wrongpasswordentered==0||user[0].wrongpasswordentered==1||user[0].wrongpasswordentered==2||user[0].wrongpasswordentered==3){
                        User.update({wrongpasswordentered:user[0].wrongpasswordentered+1},{where:{id:user[0].id}})
                        res.status(401).json({success:false,message:`Password Is Incorrect, You Have ${`${user[0].wrongpasswordentered}`- 4} Chances Left`});
                    } else if((user[0].wrongpasswordentered+1)>=5){
                        if(user[0].wrongpasswordentered==4){
                            User.update({wrongpasswordentered:user[0].wrongpasswordentered+1},{where:{id:user[0].id}})
                        }
                        setTimeout(()=>{User.update({wrongpasswordentered:0},{where:{id:user[0].id}})},24*60*60*1000)
                        res.status(404).json({success:false,message:" You Are Blocked, Try After 24 Hours"});
                    }
                }
            }) 
        }else{
            res.status(404).json({success:false,message:"User Not Found"});
        }  
        await t.commit();
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false,message:err})
    }
}