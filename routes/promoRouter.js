const express=require('express')
const bodyParser=require('body-parser')

const promoRouter=express.Router()
promoRouter.use(bodyParser.json())


promoRouter.route('/:promoId').all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain')
    next()
})
.get((req,res,next)=>
{
    res.end("Will send"+req.params.promoId)
})
.post((req,res,next)=>
{
    res.statusCode=403
    res.end("Post operation not supported")
})
.put((req,res,next)=>
{
    res.end("Will add the promo " +req.body.name +'with details' +req.body.description)
})
.delete((req,res,next)=>{
    res.end("Deleting the promos "+req.params.promoId)
})

promoRouter.route('/').all((req,res,next)=>
{
    res.statusCode=200
    res.setHeader('Constent-Type','text/plain')
    next()
})
.get((req,res,next)=>
{   
    res.end("Will send all promos ")
})
.post((req,res,next)=>
{
    res.end("Will add the promos " +req.body.name+'with details' +req.body.description)
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

module.exports=promoRouter