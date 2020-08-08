const express=require('express')
const bodyParser=require('body-parser')

const leaderRouter=express.Router()
leaderRouter.use(bodyParser.json())


leaderRouter.route('/:leaderId').all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain')
    next()
})
.get((req,res,next)=>
{
    res.end("Will send"+req.params.leaderId)
})
.post((req,res,next)=>
{
    res.statusCode=403
    res.end("Post operation not supported")
})
.put((req,res,next)=>
{
    res.end("Will add the leader " +req.body.name +'with details' +req.body.description)
})
.delete((req,res,next)=>{
    res.end("Deleting the dishes "+req.params.leaderId)
})

leaderRouter.route('/').all((req,res,next)=>
{
    res.statusCode=200
    res.setHeader('Constent-Type','text/plain')
    next()
})
.get((req,res,next)=>
{   
    res.end("Will send all leaders ")
})
.post((req,res,next)=>
{
    res.end("Will add the leader " +req.body.name+'with details' +req.body.description)
})
.put((req,res,next)=>
{
    res.statusCode=403
    res.end("Put operation not supported")
})
.delete((req,res,next)=>
{
    res.end("Deleting the leaders")
});

module.exports=leaderRouter