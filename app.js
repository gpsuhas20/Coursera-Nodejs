var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');// to encrypt and decrypt cookie
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishesRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const mongoose=require('mongoose');

const Dishes=require('./models/dishes')
const Promotions=require('./models/promotions')

const url='mongodb://localhost:27017/conFusion'
const connect=mongoose.connect(url,{useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true})
connect.then((db)=>
{
  console.log("Connected Correctly to the server")
},(err)=>{console.log(err)}
)
//Signed cookies give time-limited resource access to a set of files, 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));


function auth(req,res,next)
{
  console.log(req.signedCookies);
// authentication is done only when the user does not have a cookie.
  if(!req.signedCookies.user)// means the user is not authenticated. he wont be having a cookie
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
  
    if(username==='admin'&& password==="password")
    {
      res.cookie('user','admin',{signed:true}) // thats the reason we are checking the user in cookie checker
      next();
    }
    else{
      var err=new Error('You are not authenticated')
      res.setHeader("WWW-Authenticate",'Basic');
      err.status=401;
      return next(err)
    }

  }
  else{
    if(req.signedCookies.user==='admin'){
      next();
    }
    else{
      var err=new Error('You are not authenticated');
      err.status=401;
      return next(err);
    }
  }
}

app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishesRouter)
app.use('/leaders',leaderRouter)
app.use('/promotions',promoRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
