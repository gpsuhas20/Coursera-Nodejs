var express = require('express');
const router = express.Router();

const User=require('../models/user');
const leaderRouter = require('./leaderRouter');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req,res,next)
{
  User.findOne({username:req.body.username})
  .then((user)=>{
    if(user!=null)
    {
      var err=new Error('User '+req.body.username +' already exists');
      err.status=403;
      next(err);
    }
    else{
      return User.create({
        username:req.body.username,
        password:req.body.password
      });
    }

  })// after the new user is signe up
  .then((user)=>
  {
    res.statusCode=200;
    res.setHeader("Content-Type",'application/json');
    res.json(({status:'Registration Successful',user:user}))

  },(err)=>next(err))
  .catch((err)=>next(err));
});
router.post('/login',(req,res,next)=>
{
  if(!req.session.user)// means the user is not authenticated. he wont be having a cookie
  {
    var authHeader=req.headers.authorization;

    if(!authHeader)
    {
      var err=new Error('You are not authenticated')
      res.setHeader("WWW-Authenticate",'Basic');
      err.status=401;
      return next(err);
    }
    // auth contains an array of username and password.
    var auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');// o contains base and 2nd username:password  againn split based on colon
    
    var username=auth[0];
    var password=auth[1];

    User.findOne({username:username})
    .then((user)=>
    {
      if(user==null)// when user not found
      {
        var err=new Error('User ' +Username+ 'does not exist')
        err.status=403;
        return next(err)
      }
      else if(user.password!==password) //password in db and password typed are compared
      {
        var err=new Error('Your Password is Incorrect');
        err.status=403;
        return next(err)
      }
       else if(user.username===username && user.password===password)
      {
       req.session.user='authenticated';
       res.statusCode=200;
       res.setHeader('Content-Type','text/plain');
       res.end("You are authenticated");
        return next(err);
      }  
    })
    .catch((err)=>next(err)); // error is handled in the app.js
   
  }
  else{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    res.end("You are already authenticated!"); 
  }
  router.get('/logout',(req,res)=>
  {
    if(req.session)
    {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else{
      var err=new Error("You are not Logged in");
      err.status=403;
      next(err);

    }
  }
)
 
});
 
module.exports = router;
