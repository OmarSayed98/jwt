const { Router }=require('express');
const router=Router();
const users=require('../models/users');
const jwt=require('jsonwebtoken');
const handleerror=(err)=>{
    let error={email:'',password:''};
    if(err.code===11000){
        error.email='this email is already registered';
        return error;
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
    res.render('signup');
});
router.post('/',(req,res)=>{
    const {email,password}=req.body;
    const user=new users({
        email:email,
        password:password
    });
    user.save().then((userT)=>{
        console.log('user saved');
        const token=createtoken(userT._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxage*1000});
        res.status(200).send({user:userT._id});
    }).catch((err)=>{
        res.status(400).send({ errors:handleerror(err) });
    });
});
module.exports=router;