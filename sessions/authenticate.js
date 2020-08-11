/*var passport =require('passport');
var LocalStrategy=require('passport-local').Strategy// the way of authenticating is  called a startegy.
// this will allow all the checking of usernamene and password .
// this strategy must be applied to the schema of the authentication.
var User=require('./models/user');
// example inside website another login college student.in vtu
passport.use(new LocalStrategy(User.authenticate()));
// this is inbuilt function to authenticat users.
passport.serializeUser(User.serializeUser());// it determines what data of the user  must be used in the session.
passport.deserializeUser(User.deserializeUser());// it detcahes the data stored in the session
// serialize will make the data that is unique to each user and converts to seesion id
// the attribute to be choosen is left to the dev to implement.*/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
