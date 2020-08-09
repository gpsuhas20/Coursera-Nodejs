const express=require('express');

const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const Dishes=require('../models/dishes')

const dishRouter=express.Router()// it makes dishRouter as a router
dishRouter.use(bodyParser.json())

//fisrt go for specific routing

dishRouter.route('/')
.get((req,res,next)=>
{   
    Dishes.find({})///.then(()=>callback,err)
    .then((dishes)=>
    {
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(dishes)
    },(err)=>next(err)).catch((err)=>next(err));
    
})
.post((req,res,next)=>
{
    Dishes.create(req.body)
    .then((dish)=>
    {
        console.log("Dish Created",dish)
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>
{
   res.statusCode=403;
   res.end("PUT operation not supported on /dishes");
})
.delete((req,res,next)=>
{
   Dishes.remove({})
   .then((resp)=>
   {
       res.statusCode=200;
       res.setHeader("Content-Type",'application/json')
       res.json(resp);

   },(err)=>next(err))
   .catch((err)=>next(err));
});

dishRouter.route('/:dishId')
.get((req,res,next)=>
{   
  Dishes.findById(req.params.dishId)
  .then((dish)=>
    {
        console.log("Dish Created",dish)
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>
{
    res.statusCode=403;
    res.end("Will add the dish " +req.body.name+'with details' +req.body.description)
})
.put((req,res,next)=>
{
  Dishes.findByIdAndUpdate(req.params.dishId,{$set:req.body}
    ,{new:true})
  .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next)=>
{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>
   {
       res.statusCode=200;
       res.setHeader("Content-Type",'application/json')
       res.json(resp);

   },(err)=>next(err))
   .catch((err)=>next(err));
});
// next() searches for the next middleware.
// the req and res will be pased on after next()

module.exports=dishRouter;