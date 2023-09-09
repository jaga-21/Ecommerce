import express from "express";
import productQuery from "../../helpers/query.js";
import DBfuncs from "../../databaseConnection.js";
import prodFilterRouter from "./productFilter.js";
import axios from "axios";
import util from "util";
import { flushAll, getAllKeys, redisClient } from "../../helpers/redis.js";
import { getOrSetCache } from "../../helpers/redis.js";
import { comments } from "../../dummy.js";
import productCommentRouter from "./comments.js";
const productRouter = express.Router();

const FAKEAPI_URL = "https://fakestoreapi.com";

const dbConnection = DBfuncs.connection;
productRouter.use("/filter", prodFilterRouter);
productRouter.use('/comments',productCommentRouter)

productRouter.get("/", async (req, res) => {
  console.log("before ");
  console.log(getAllKeys());
  console.log("get all products reached");
  // store in redis
  const response = await getOrSetCache("allProducts", async () => {
    const { data } = await axios.get(
      `${FAKEAPI_URL}/products`,
      (err, result) => {
        if (err) console.log(err);
        console.log("prodoucts list " + result);
        return result;
      }
    );
    return data;
  });
  //   console.log("all the keys of redis "+ getAllKeys() )
  //   console.log("response =>"+response)
  console.log("after ");
  console.log(getAllKeys());
  res.status(200).json(response);
});
productRouter.get("/:id", async (req, res) => {
  const productId = req.params.id;
  const response = await getOrSetCache(`products:${productId}`, async () => {
    const { data } = await axios.get(
      `${FAKEAPI_URL}/products/${productId}`,
      (err, result) => {
        if (err){
          console.log(err)
          return;
        }
        console.log(`result of product ${productId} =>`+result)
        return result;
      }
    );
    return data;
  });
  console.log(getAllKeys());
  res.send(response);
});
function updateComments(comment){
  
}





// productRouter.post('/comments/:id',(req,res)=>{

//   const comment=req.body.comment
//   console.log(comment)
//   comments=[...comments,comment]
//   return res.status(200).json(comments)
// })

productRouter.delete("/delete/", (req, res) => {
  flushAll();
  res.json({ message: "deleted succesfully" });
});
export default productRouter;
