import jwt from "jsonwebtoken";
import httpError from "http-errors";


const createAccessToken = (id) => {
    try {
      const payload = { id: id };
      const key = process.env.ACCESS_TOKEN;
      const options = {
        expiresIn: "1h",
        algorithm:"HS256"
      };
      const token =jwt.sign(payload, key, options)
      return token 
    } catch (err) {
     console.log(err)
    }
 
};
const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next(httpError.Unauthorized());
  const token = req.headers["authorization"].split("")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
    if (err) {
      const message =
        err.message === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(httpError.Unauthorized(message));
    }
    res.payload = payload;
    next();
  });
};

const createRefreshToken = (id) => {
    try{
      const payload = { id: id };
    const key = process.env.REFRESH_TOKEN;
    const options = {
      expiresIn: "1y",
    };
    const token =jwt.sign(payload, key, options)
     redisFuncs.setRedis(id, token, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      
      });
      return token

    }
    catch(e){
      console.log(e)
    }
    

};

const verifyRefreshToken = (token) => {
  return new Promise((reject, resolve) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, result) => {
      if (err) {
        console.log(err.message);
        reject(httpError.Unauthorized());
      }
      memFuncs.getFunction(user.id, (err, result) => {
        if (result === token) return resolve(token);
        return reject(httpError.Unauthorized());
      });
    });
  });
};
const jwtfuncs = {
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  verifyRefreshToken,
};
export default jwtfuncs;
