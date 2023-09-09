import express from "express"
import DBfuncs from "../../databaseConnection.js"



const db=DBfuncs.connection
const productCommentRouter=express.Router()
productCommentRouter.get('/',async(req,res)=>{
    const query="select *from comments"
    db.query(query,(err,result)=>{
    if(err){
        console.log("error occured while retreiving comments from db")
        console.log(err)
        res.send(err)
        return err
    }
    console.log(result)
    res.send(result)
    })
  })
productCommentRouter.post('/:id',(req,res)=>{
    const element=req.body.comment
    console.log(element)
    const comment_text=element.comment
    const product_id=req.params.id
    const user_id=element.user.id
    const rating =element.rating
    const insertComments="Insert into comments (comment_text,user_id,product_id,rating) values(?,?,?,?)"
    db.query(insertComments,[comment_text,product_id,user_id,rating],(err,result)=>{
         if(err){    
             console.log(err)
         }
         else{
             return result
         }
     })
})
export default productCommentRouter