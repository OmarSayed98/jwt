const login=require('./login');
const signup=require('./signup');
const logout=require('./logout');
module.exports=(app)=>{
    app.use('/login',login);
    app.use('/signup',signup);
    app.use('/logout',logout);
}