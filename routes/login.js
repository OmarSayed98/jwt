const { Router }=require('express');
const router=Router();
const user=require('../models/users');
const jwt=require('jsonwebtoken');
const handleerror=(err)=>{
    let error={email:'',password:''};
    if(err.code===11000){
        error.email='this email is already registered';
        return error;
    }
    if(err.message==='incorrect email'){
        error.email='incorrect email';
    }
    if(err.message==='incorrect password'){
        error.password='incorrect password';
    }
    if(err.message.includes('users validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path]=properties.message;
        });
    }
    return error;
}
const maxage=3*24*60*60;
const createtoken=(id)=>{
    return jwt.sign({id},'secret',{expiresIn:maxage })
}
router.get('/',(req,res)=>{
    res.render('login');
});
router.post('/',(req,res)=>{
    const {email,password}=req.body;
    user.login(email,password)
        .then(final=>{
            const token=createtoken(final._id);
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxage*1000});
            res.status(200).send({user:final._id});
        })
        .catch(err=>{
            console.log(err.message);
            res.status(400).send({errors:handleerror(err)});
        })
});
module.exports=router;