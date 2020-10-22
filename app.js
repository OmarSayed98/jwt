const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const index=require('./routes/index');
const cookieparser=require('cookie-parser');
const {requireauth,checkuser}=require('./middleware/auth');
// middleware
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieparser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://127.0.0.1:27017node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) =>{
      console.log("connected to db");
      app.listen(3000);
  })
  .catch((err) => console.log(err));

// routes
app.get('*',checkuser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireauth, (req, res) => res.render('smoothies'));
app.get('/getcookie',(req,res)=>{
    res.cookie('user',false,{maxAge:1000*60*60*24,httpOnly:true});
    res.send('nice cookie');
});
index(app);