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


dishRouter.route('/:dishId/comments')
.get((req,res,next)=>
{   
    Dishes.findById(req.params.dishId)///.then(()=>callback,err)
    .then((dish)=>
    {
        if(dish!=null)
        {
            res.statusCode=200;
            res.setHeader("Content-Type",'application/json')
            res.json(dish.comments)
        }
       else{
           err=new Error("Dish"+req.params.dishId+'not found')
           err.status=404;
           return next(err);
       }
    },(err)=>next(err)).catch((err)=>next(err));
    
}) // inner error is generated when the find operation is done and the dish is not found
//outer error is generated when there is no response from the 
.post((req,res,next)=>
{
    Dishes.findById(req.params.dishId)
    .then((dish)=>
    { if(dish!=null)
        {
            
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>
            {
                res.statusCode=200;
                res.setHeader("Content-Type",'application/json');
                res.json(dish);

            },(err)=>next(err));
          
        }
       else{
           err=new Error("Dish"+req.params.dishId+'not found')
           err.status=404;
           return next(err);
       }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>
{
   res.statusCode=403;
   res.end("PUT operation not supported on /dishes/"+req.params.dishId+'/comments');
})
.delete((req,res,next)=>
{
    Dishes.findById(req.params.dishId)
   .then((dish)=>
   {
    if(dish!=null)
    {
        //console.log("Comments removed"+dish.comments.id)
     for(var i=(dish.comments.length-1);i>=0;i--)  

     {
         dish.comments.id(dish.comments[i]._id).remove();
     }
     dish.save()
     .then((dish)=>
     {
         res.statusCode=200;
         res.setHeader("Content-Type",'application/json');
         res.json(dish);

     },(err)=>next(err));
    }
   else{
       err=new Error("Dish"+req.params.dishId+'not found')
       err.status=404;
       return next(err);
   }
       res.statusCode=200;
       res.setHeader("Content-Type",'application/json')
       res.json(resp);

   },(err)=>next(err))
   .catch((err)=>next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>
{   
  Dishes.findById(req.params.dishId)
  .then((dish)=>
    {
        if(dish!=null && dish.comments.id(req.params.commentId)!=null)// when both the dish and the comment is available only. 
        {
            res.statusCode=200;
            res.setHeader("Content-Type",'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if(dish ==null)
        {
            err=new Error('Dish' + req.params.dishId+'not found');
            err.status=404;
            return next(err);
        }
        else{
            err=new Error('Comment '+req.params.commentId +'not found')
            err.status=404;
            return next(err);
        }

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>
{
    res.statusCode=403;
    res.end("Post operation is not possible")
})
.put((req,res,next)=>
{
  Dishes.findByIdAndUpdate(req.params.dishId)
  .then((dish) => {
    if(dish!=null && dish.comments.id(req.params.commentId)!=null)// when both the dish and the comment is available only. 
    {
        if(req.body.rating)
        {
            dish.comments.id(req.params.commentId).rating=req.body.rating;
        }
        if(req.body.comment)
        {
            dish.comments.id(req.params.commentId).comment=req.body.comment;

        }    
        dish.save()
            .then((dish)=>
            {
                res.statusCode=200;
                res.setHeader("Content-Type",'application/json');
                res.json(dish);

            },(err)=>next(err));

        res.statusCode=200;
        res.setHeader("Content-Type",'application/json');
        res.json(dish.comments.id(req.params.commentId));
    }
    else if(dish ==null)
    {
        err=new Error('Dish' + req.params.dishId+'not found');
        err.status=404;
        return next(err);
    }
    else{
        err=new Error('Comment '+req.params.commentId +'not found')
        err.status=404;
        return next(err);
    }

},(err)=>next(err))
.catch((err)=>next(err));
})
.delete((req,res,next)=>
{
    Dishes.findByIdAndRemove(req.params.dishId)
            //.then(()=>callback,err)
    .then((dish)=>
    {
        if(dish!=null && dish.comments.id(req.params.commentId)!=null)
        {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish)=>
            {
                res.statusCode=200;
                res.setHeader("Content-Type","application/json")
                res.json(dish);
            },(err)=>next(err));
        }
        else if(dish ==null)
        {
            err=new Error('Dish' + req.params.dishId+'not found');
            err.status=404;
            return next(err);
        }
        else{
            err=new Error('Comment '+req.params.commentId +'not found')
            err.status=404;
            return next(err);
        }
    },(err)=>next(err)
      
    )
   .catch((err)=>next(err));
});
// next() searches for the next middleware.
// the req and res will be pased on after next()

module.exports=dishRouter;