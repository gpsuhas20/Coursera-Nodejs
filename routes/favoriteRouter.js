const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Favorites =  require('../models/favorite');
const cors=require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

// 2 endpoints for fav fav/dish id

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Favorites.find({user:req.user._id})// for getting the fav dishes of that person only
    .populate('user')
    .populate('dishes.dish')
    .then((favdishes)=>
    {
        res.statusCode=200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(favdishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
   req.body.user=req.user._id;// replacing the user with userid as  per the schema.
   for(var i=0; i<req.body.dishes.length;i++)
   {
       Favorites.dishes.findById(req.body.dishes[i]._id) // finding the posted dish in array comparing in the dishes db which stores ids of dishes
      .then((dish)=>// if we are getting null we dont have the dish in org db so need to remove from the array else remove from the array.
      {
          if(dish!=null)
        {   
            req.body.dishes.id(dish._id).remove();// we are removing if the

        }
       
      })
      req.body.dishes[i]=req.body.dishes[i]._id;// replacing the value of the dishes by only dish id
   }
   Favorites.create(req.body)// saved to the db to show the output of the saved fav dish
   .then((favdish)=>
   {
       /*favorite.findById(favdish._id)
       .populate('user')
       .populate('dishes.dish')
       .then((dish)=>*/
       
        res.statusCode=200;
        res.setHeader('Content-Type' , 'application/json');
        res.json(favdish);

       }, (err) => next(err))
   .catch((err) => next(err));

})
  
 .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
     res.statusCode = 403;
     res.end('PUT operation not supported on /favorite');
 })
 
 .delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    // deleting all the favorite dishes
    Favorites.remove({})
    .then((resp) => {
     res.statusCode=200;
     res.setHeader('Content-Type' , 'application/json');
     res.json(resp);
    },  (err) => next(err))
    .catch((err) => next(err));
    
 })

 favoriteRouter.route('/:dishId')
 .options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,(req,res,next) => {
    
   Dishes.findById(req.params.dishId)
   .populate('comments.author')
   .then((dish) => {
    res.statusCode=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post( cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
})

.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
  }, {new : true})
  .then((dish) => {
    res.statusCode=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
  Dishes.findByIdAndRemove(req.params.dishId)
  .then((resp) => {
    res.statusCode=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json(resp);
   },  (err) => next(err))
   .catch((err) => next(err));
});

module.exports=favoriteRouter;

 