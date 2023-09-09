import express, { json } from "express";
import DBfuncs from "../databaseConnection.js";
import dotenv from "dotenv"
dotenv.config()
// import jwt from "jsonwebtoken";
import jwtfuncs from "../helpers/jwt.js";

import customQuery from "../helpers/query.js"
const userRouter = express.Router();

const con = DBfuncs.connection;
function RefreshToken(refreshToken, data) {
  try {
    if (!refreshToken) res.json({ message: "refresh Token doesnt exist " });
    const id = data.id;
    const accessToken = jwtfuncs.createAccessToken(id);
    const rToken = jwtfuncs.createRefreshToken(id);
    const obj = { accessToken: accessToken, refreshToken: rToken };
    
    return obj;
  } catch (err) {
    console.log(err.message);
  }
}

userRouter.get("/", (req, res) => {
  const query = "SELECT * from user";
  con.query(query, (err, result) => {
    if (err) throw err;
    else {
      res.json({ database: result, cachedata:null});
    }
  });
  // res.send("list of users" + "requested by "+data)
});
userRouter.get('/:id',(req,res)=>{
  res.send(findone(req.params.id))
  return ;
})

userRouter.delete("/delete", (req, res) => {
  const query = "DELETE FROM user WHERE id = ?";
  con.query(query, [req.body.id], (err, result) => {
    if (err) throw err;
    return result.affectedRows === 1
      ? res.send("deleted ")
      : res.status(500).send("an unexpected error occured");
  });
});

userRouter.post("/login", (req, res) => {
  
   const  email= req.body.email
   const password= req.body.password
  
  const query = "SELECT * FROM user WHERE email = ?";
   
  con.query(query, [email],async (err, result) => {
    console.log(result)
    if (err) {
      res
        .status(500)
        .json({ error: "AN error occured while retreiving from db " });
      console.log(err);
      return;
    }
    if (result.length === 0) {
      res.status(404).send("user not found ,do register");
      return;
    } else {
   
     
      const accessToken=jwtfuncs.createAccessToken()
     
      // console.log("access Token =>" + accessToken)
      // console.log(JSON.stringify(accessToken))
      // console.log(typeof(JSON.stringify(accessToken)))
      // res.cookie("auth_token","racc",{
      //   expires: new Date(Date.now() + 24 * 3600 * 1000), // 24 hours expiration
      //   httpOnly: true, // Protect the cookie from client-side JavaScript
      // })
      const object ={
        token :accessToken,
        user:result[0],  
      }
      res.status(200).send(object)
      };
  
      // const  obj={accessToken:Atoken,refreshToken:Rtoken}

      // const Accesstoken = await redisFuncs.getRedis(data.id);
      // if (Accesstoken) {
      //   const obj = {
      //     message: "logged in successFully",
      //     accessToken: Accesstoken,
      //   };
      //   res.send(obj);
      //   return;
      // } else {
      //   const reToken = await redisFuncs.getRedis(JSON.parse(data.id.refreshToken));
      //   if (reToken) {
      //     const newAccessToken = jwtfuncs.createAccessToken(data.id);
      //     redisFuncs.setRedis(user.id, JSON.stringify({
      //       accessToken: newAccessToken,
      //       refreshToken: reToken,
      //     }));
      //     return;
      //   } else {
      //     const { accessToken, refreshToken } = RefreshToken(reToken, data);
      //   }
      //   res.send("logged in successfully", {
      //     accessToken: Accesstoken,
      //     refreshToken: refreshToken,
      //   });
      // }
      // res.json({ message: "Token expired" });
    
  });
  console.log("login");
});
userRouter.post("/logOut", (req, res) => {
  try {
    const { refreshToken, user } = req.body;
    if (!refreshToken) res.json("refreshToken not Present");
    const userId = jwtfuncs.verifyRefreshToken(refreshToken);
    if (userId) {
      memFuncs.deleteFunction(userId);
    }
  } catch (err) {
    console.log(err.message);
    res.json({ message: err.message });
  }
});

const findone = (email) => {
  const query = "SELECT * FROM user WHERE email= ?";
  con.query(query, [email], (err, result) => {
    if (err) {
      console.log("error while checking duplicates");
      console.log(err);
      return;
    }
    return result !== null ? result : null;
  });
};

//register
userRouter.post("/register", (req, res) => {
  const data = req.body;
  const fn=data.fullname
  const email=data.email
  const no = data.phoneNumber;
  const pw = data.password;

  try {
    const exist = findone(email);
    if (!exist) {
      const query =customQuery.registerUser
      con.query(query, [ fn, pw, no,email ], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: err.message });
        } else {
          console.log(result.affectedRows);

          const accessToken = jwtfuncs.createAccessToken(email);
          const refreshToken = jwtfuncs.createRefreshToken(email);

          const obj = { accessToken: accessToken, refreshToken: refreshToken };
          // redisFuncs.setRedis(email, obj);
          res.send({ accessToken: accessToken, refreshToken: refreshToken });
        }
      });
    } else {
      res.send({ message: "User already exist with that id" });
    }
  } catch (err) {
    console.log(err);
  }
});
userRouter.get("/addNewPassword", (req, res) => {
  console.log("add password");
});
userRouter.post('/modifyUser',(req,res)=>{
   const {data}=req.body
   const id = data.id;
   const fn = data.firstName;
   const ln = data.lastName;
   const no = data.phoneNumber;
   const pw = data.password;
   
   const query=customQuery.modifyUser
   con.query(query,[fn,ln,no,pw,id],(err,result)=>{
    if(err){
      console.log(err)
    }
    console.log(result.affectedRows)
   })
})


 

export default userRouter;
