const mongoose=require('mongoose');
const schema=mongoose.Schema;
const {isEmail}=require('validator');
const bcrypt=require('bcrypt');
const userschema=new schema({
    email:{
        type:String,
        required:[true,'please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'please enter a password'],
        minlength:[6,'min length is 6 chars']
    }
});
//fire before saving
userschema.pre('save',async function (next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
});
//static methods to login
userschema.statics.login=function(email,password){
    return this.findOne({email})
        .then(result=>{
            if(result){
                return bcrypt.compare(password,result.password)
                    .then(userresult=>{
                        if(userresult){
                            return result;
                        }
                        throw new Error('incorrect password')
                    });
            }
            else {
                throw new Error('incorrect email');
            }
        });
}
const user=mongoose.model('users',userschema);
module.exports=user;
