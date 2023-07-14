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

exports.postSignup = async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const {name, email,password} = req.body;
        if(isStringEmpty(name)||isStringEmpty(email)||isStringEmpty(password)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const users = await User.findAll();
        for(let i=0;i<users.length;i++){
            if(users[i].email==email){
                return res.status(400).json({message:"Email Already Exist! Try Different Email",success:false});
            }
        }
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            await User.create({name:name,email:email,password:hash},{transaction:t});
            await t.commit();
            res.status(201).json({message:"Successfully Created New User",success:true});
        })
        
    }catch(err){
        await t.rollback();
        console.log(err);
        res.status(500).json({message:err,success:false})
    }
}

