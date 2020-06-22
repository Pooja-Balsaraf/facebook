var express=require('express');
var passport=require('passport');
const bodyParser = require('body-parser');
var Strategy=require('passport-facebook').Strategy;



//Strategy is object
passport.use(new Strategy({
    clientID: "272075470780507",
    clientSecret: "5eea9ed96b708fbea0c656a293cbf379",
    callbackURL: "https://facebook-node-app.herokuapp.com/login/facebook/callback"
},


function(accessToken, refreshToken, profile, cb){
    return cb(null,profile);
 }
 )); 

 passport.serializeUser(function(user,cb){
     cb(null,user);
 });

 passport.serializeUser(function(obj,cb){
    cb(null,obj);
});

var app=express();

app.set('views',__dirname + '/views');
app.set('view engine','ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({extended: false}))

app.use(require('express-session')({secret:'lco app',resave: true,saveUninitialized: true}));

var port=process.env.PORT || 3000;

//route - GET  /home

app.get('/',(req,res)=>{
    res.render('home',{
        user: req.user
    });
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/login/facebook',passport.authenticate('facebook'));

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  //acess:private

  app.get('/profile',require('connect-ensure-login').ensureLoggedIn()),(req,res)=>{
      res.render('profile',{
          user:req.user
      });
  }

  
app.listen(port,()=>{
    console.log(`your server is running on ${port}`);
})