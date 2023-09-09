import express from "express"
import DBfuncs from "../databaseConnection.js"
import insertComments from "../helpers/query.js"
import { comments } from "../dummy.js"



const adminRouter =express.Router()
const db =DBfuncs.connection
adminRouter.get('/upload_comments',(req,res)=>{
    console.log("uploading......")
    const productArray=comments
    comments.forEach(element => {
       
       const comment_text=element.body
       const product_id=element.postId
       const user_id=element.user
       const rating =element.rating
       db.query(insertComments,[comment_text,product_id,user_id,rating],(err,result)=>{
            if(err){    
                console.log(err)
            }
            else{
                return result
            }
        })
    });
    res.send({message:"uploaded successflly"})
})
export default adminRouter