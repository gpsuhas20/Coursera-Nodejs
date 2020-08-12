var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
//const { authenticate } = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser,authenticate.verifyAdmin,function(req, res, next) {
  User.find({})
    .then((user)=>
    {
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(user)
    },(err)=>next(err)).catch((err)=>next(err));
  
});
// earlier username and password.
router.post('/signup',function(req,res,next)
{
  User.register(new User ({username:req.body.username}),req.body.password,(err,user)=>
  { // if the user is already registered u get an automatic error message.
    //only after successfully registering 
    if(err) 
    {
      res.statusCode=500;
      res.setHeader("Content-Type",'application/json');
      res.json(({err:err}))
    }
    else{
      //user from the callback function.
      if(req.body.firstname)
      user.firstname=req.body.firstname;
      if(req.body.lastname)
      user.lastname=req.body.lastname;
// saving to the databse user is not variable here
      user.save((err,user)=>
      {
        if(err)
        {
          res.statusCode=500;
          res.setHeader("Content-Type",'application/json');
          res.json(({err:err}));
          return;
        }
        passport.authenticate('local')(req,res,()=>
        {
          res.statusCode=200;
          res.setHeader("Content-Type",'application/json');
          res.json(({success:true,status:'Registration Successful'}))
        });
      })
    }
  });
  
});

router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});
router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not loggged in !');
    err.status= 403;
    next(err);
  }
})

module.exports = router;
