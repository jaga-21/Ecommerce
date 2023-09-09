import express from 'express'
import userRouter from "./routes/users.js"
import bodyParser from 'body-parser'
import cors from "cors"
import funcs from "./databaseConnection.js"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import productRouter from './routes/product/product.js'
import cartRouter from './routes/cart/cart.js'
import  adminRouter  from './routes/admin.js'
const app=express()
app.use(cors())
dotenv.config()



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser(),(err,result,next)=>{
//     if(err)console.log("index error in cookie parser => "+ err.message)
//     if(result){
//         console.log(result)
//     }
//     next()
// })



funcs.isConnected()

app.use('/users',userRouter)
app.use('/products',productRouter)
app.use('/cart',cartRouter,(err,req,res,next)=>{
    if(err)throw err
    next()
})
app.use('/admin',adminRouter)



app.get('/',(req,res)=>{
    console.log("connected ")
})



app.listen(process.env.PORT,()=>{
    console.log("connected at "+process.env.PORT)
})