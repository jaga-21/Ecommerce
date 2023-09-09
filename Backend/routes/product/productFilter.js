import express from "express"
import DBfuncs from "../../databaseConnection.js"
import productQuery from "../../helpers/query.js"


const prodFilterRouter=express.Router()
const DBcon =DBfuncs.connection
 

// const commentFilter = ["All", "Most Recent", "Old", "Positive First", "Negative First"]
prodFilterRouter.get('/Most Recent',(req,res)=>{
    const type =req.body.filterType
    const query = productQuery.filterMostRecent
    DBcon.query(query,(err,result)=>{
       if(err){
        console.log(err)
       }
       res.send(result)
    })
    
})
prodFilterRouter.get('/old',(req,res)=>{
    const type =req.body.filterType
    const query = productQuery.filterMostRecent
    DBcon.query(query,(err,result)=>{
       if(err){
        console.log(err)
       }
       res.send(result)
    })
    
})
prodFilterRouter.get('/Negative First',(req,res)=>{
    const type =req.body.filterType
    const query = productQuery.filterNegativeFirst
    DBcon.query(query,(err,result)=>{
       if(err){
        console.log(err)
       }
       res.send(result)
    })
    
})
prodFilterRouter.get('/Positive First',(req,res)=>{
    const type =req.body.filterType
    const query = productQuery.filterPositiveFirst
    DBcon.query(query,(err,result)=>{
       if(err){
        console.log(err)
       }
       res.send(result)
    })
    
})


export default prodFilterRouter

