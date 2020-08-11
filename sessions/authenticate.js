

/*var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;// Local amazon fb,g+ 
var User = require('./models/user');// we are applying the auth to the mongoose local fiels
var JwtStrategy=require('passport-jwt').Strategy;// the way if auth
var ExtractJwt=require('passport-jwt').ExtractJwt;// to extract from the header the token
var jwt=require('jsonwebtoken');// for using jwt tokens

// in jwt the client will be given a token from the server and server doesnt maintain any sessions , whenever a req is made from the client 
//we should pass the token in the request and the server verifies the token.
var config=require('./config');





passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken=function(user)
{
    return jwt.sign(user,config.secretKey,
        {expiresIn:3600});
};
// this function is used to 
//3600 seconds

var opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
// it tell how to extarct jwt from body of the req.
opts.secretOrKey=config.secretKey; // secret key present in the server side.

exports.jwtPassport=passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>
    {
        console.log("JWT payload ", jwt_payload)
        User.findOne({_id:jwt_payload._id},(err,user)=>
        { // the data from the payload contains an id which is searched in db.
            if(err)
            {
                return done(err,false);
            }
            else if(user)
            {
                return done(null,user)
            }
            else{
                return done(null,false) // user not found // can be used to new user at this point.
            }
        })
    }))
exports.verifyUser=passport.authenticate('jwt',{session:false});
// this verify user  function will authenticate the user whenever its called.

//(strategy ,session)
// verify function.
// done is the callback through which we send the info which uses to load things on req message.
*/
