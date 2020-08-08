const express=require('express')
const bodyParser=require('body-parser')

const dishRouter=express.Router()// it makes dishRouter as a router
dishRouter.use(bodyParser.json())

//fisrt go for specific routing

dishRouter.route('/:dishId').all((req,res,next)=>
{
    res.statusCode=200
    res.setHeader('Constent-Type','text/plain')
    next()
})
.get((req,res,next)=>
{   
    res.end("Will send "+ req.params.dishId)
})
.post((req,res,next)=>
{
    res.statusCode=403
    res.end("Post operation not supported")
  
})
.put((req,res,next)=>
{
    res.end("Will add the dish " +req.body.name+'with details' +req.body.description)
})
.delete((req,res,next)=>
{
    res.end("Deleting the dishes" +req.params.dishId)
});

dishRouter.route('/').all((req,res,next)=> // this middleware will be excuted for all the  routes of /dishes
{
    res.statusCode=200
    res.setHeader('Constent-Type','text/plain')
    next()
})
.get((req,res,next)=>
{   
    res.end("Will send all the dishes to you")
})
.post((req,res,next)=>
{
    res.end("Will add the dish " +req.body.name+'with details' +req.body.description)
})
.put((req,res,next)=>
{
    res.statusCode=403
    res.end("Put operation not supported")
})
.delete((req,res,next)=>
{
    res.end("Deleting the dishes")
});
// next() searches for the next middleware.
// the req and res will be pased on after next()

module.exports=dishRouter;