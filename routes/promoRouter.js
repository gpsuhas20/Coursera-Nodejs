const express=require('express')
const bodyParser=require('body-parser')

const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
const Promotions=require('../models/promotions');
const authenticate=require('../authenticate');

promoRouter.route('/')
.get((req,res,next)=>
{   
   Promotions.find({})
    .then((promos)=>
    {
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(promos)
    },(err)=>next(err)).catch((err)=>next(err));
})
.post((req,res,next)=>
{
    Promotions.create(req.body)
    .then((promo)=>
    {
        console.log("Promo Created",promo)
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>
{
    res.statusCode=403
    res.end("Put operation not supported /promotions")
})
.delete(authenticate.verifyUser,(req,res,next)=>
{
    Promotions.remove({})
    .then((resp)=>
    {
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(resp);
 
    },(err)=>next(err))
    .catch((err)=>next(err));
});


promoRouter.route('/:promoId')
.get((req,res,next)=>
{   
  Promotions.findById(req.params.promoId)
  .then((dish)=>
    {
        console.log("Pro motio Created",dish)
        res.statusCode=200;
        res.setHeader("Content-Type",'application/json')
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>
{
    res.statusCode=403;
    
})
.put(authenticate.verifyUser,(req,res,next)=>
{
  Promotions.findByIdAndUpdate(req.params.promoId,{$set:req.body}
    ,{new:true})
  .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>
{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>
   {
       res.statusCode=200;
       res.setHeader("Content-Type",'application/json')
       res.json(resp);

   },(err)=>next(err))
   .catch((err)=>next(err));
});

module.exports=promoRouter