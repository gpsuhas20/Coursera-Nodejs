const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes =  require('../models/dishes');
const cors=require('./cors');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,(req,res,next) => {
   Dishes.find({})
   .populate('comments.author')// for populating with the author field.
   .then((dishes) => {
       res.statusCode=200;
       res.setHeader('Content-Type' , 'application/json');
       res.json(dishes);
   }, (err) => next(err))
   .catch((err) => next(err));
})

.post( cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
   Dishes.create(req.body)
   .then((dish) => {
       console.log('Dish created ', dish);
       res.statusCode=200;
       res.setHeader('Content-Type' , 'application/json');
       res.json(dish);
   },  (err) => next(err))
   .catch((err) => next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
   Dishes.remove({})
   .then((resp) => {
    res.statusCode=200;
    res.setHeader('Content-Type' , 'application/json');
    res.json(resp);
   },  (err) => next(err))
   .catch((err) => next(err));
})

dishRouter.route('/:dishId')
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


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,(req,res,next) => {
   Dishes.findById(req.params.dishId)
   .populate('comments.author')
   .then((dish) => {
       if(dish!=null) {
            res.statusCode=200;
            res.setHeader('Content-Type' , 'application/json');
            res.json(dish.comments);
       }
       else {
           err = new Error('Dish ' + req.params.dishId+ ' not found');
           err.status =404;
           return next(err);
       }
    }, (err) => next(err))
   .catch((err) => next(err));
})

.post( cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
   Dishes.findById(req.params.dishId)
   .then((dish) => {
    if(dish!=null) {
        // in the dishes schema we are getting the id of the author not the name so 
        // name must be replaced before passing the value to the comments.
       req.body.author=req.user._id;// updated by the authenticate verify user.so req.user wiil be loaded to req object.
        dish.comments.push(req.body);// in form we are taking the name of the author but we are modifying to support our schema.
        dish.save()
        .then((dish) => {
            Dishes.findById(dish._id)
            .populate('comments.author')// here we have stored only id by changing the req and so before sending the value to the client we have to replace the id of the user with the author.by referring to the user.js
            .then((dish)=>
            {
                res.statusCode=200;
                res.setHeader('Content-Type' , 'application/json');
                res.json(dish);
            }) 
        }, (err) => next(err));
    }
   else {
       err = new Error('Dish ' + req.params.dishId+ ' not found');
       err.status =404;
       return next(err);
   }
   },  (err) => next(err))
   .catch((err) => next(err));
})

.put( cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'+
                req.params.dishId+ '/comments');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
   .then((dish) => {
    if(dish!=null) {
       for (var i= (dish.comments.length -1); i>=0; i--){
           dish.comments.id(dish.comments[i]._id).remove();
       }
       dish.save()
        .then((dish) => {
            res.statusCode=200;
            res.setHeader('Content-Type' , 'application/json');
            res.json(dish);
        }, (err) => next(err));
   }
   else {
       err = new Error('Dish ' + req.params.dishId+ ' not found');
       err.status =404;
       return next(err);
   }
   },  (err) => next(err))
   .catch((err) => next(err));
})

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
/*.put(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)// to replace the user id with the comments.
                //.populate('comments.author')
                .then((dish)=>
                {
                    for(var i=(dish.comments.length-1);i>=0;i--)
                    {
                        var a=dish.comments.id(dish.comments[i]._id);
                        if(a.author===req.user)
                        {
                            Dishes.findById(dish._id)
                            .populate('comments.author')
                            .then((dish)=>
                            {
                                res.statusCode=200;
                                res.setHeader('Content-Type','application/json')
                                res.json(dish);
                            },(err)=>next(err))
                        }
                    }
                    
                },(err)=>next(err))
                            
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
*/


.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => { // comment id is passed as a route id.
    Dishes.findById(req.params.dishId).then((dish) => {
        console.log(dish.comments[0]._id); // the comments are in a array.
    // dish.comments will give array of objects has comment will have a object.
        console.log(dish.comments.id(req.params.commentId)); // comments is a sub-schema so we can use .id and pass comment id to it to access the complete details of the comment. 
        if (dish != null && dish.comments.id(req.params.commentId)) {
            if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {// here we are checking dish.comments.id(req.params.commentId) gives the 
                /* 
                { _id: 5f336f0705f1d61268c2b502,
  rating: 1,
  comment: 'updated comment',
  author: 5f336c84aff7ee3a6cc232f7,
  createdAt: 2020-08-12T04:24:39.662Z,
  updatedAt: 2020-08-12T15:47:44.520Z }
  and then .author.
req.user._id will be added after adding to the login.
                
                */
                err = new Error('You are not authorized to edit this comment');
                err.status = 403;
                return next(err);
            }
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }

            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err)).catch((err) => next(err));
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
})


.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId)) {
            if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
                err = new Error('You are not authorized to edit this comment');
                err.status = 403;
                return next(err);
            }
            dish.comments.id(req.params.commentId).remove();
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err)).catch((err) => next(err));
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
});

module.exports  = dishRouter