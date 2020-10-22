const jwt=require('jsonwebtoken');
const users=require('../models/users');
const requireauth=(req,res,next)=>{
    const token=req.cookies.jwt;
    //check jwt exists
    if(token){
        jwt.verify(token,'secret',(err,decodedtoken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                console.log(decodedtoken);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}
//check user
const checkuser=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret',(err,decodedtoken)=>{
            if(err){
                console.log(err.message);
                res.locals.user=null;
                next();
            }
            else{
                users.findById(decodedtoken.id)
                    .then(result=>{
                       if(result){
                           res.app.locals.user=result;
                       }
                    });
                next();
            }
        });
    }
    else{
        res.app.locals.user=null;
        next();
    }
}
module.exports={requireauth,checkuser};