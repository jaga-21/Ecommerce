import { Redis } from "ioredis";
import dotenv from "dotenv";
import util from "util"
dotenv.config();

// export const redisClient = redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   legacyMode: true,
// });
export const redisClient = new Redis({
  port: process.env.REDIS_PORT,
  host: "127.0.0.1",
});
const TTL = 3600;
export const getkeys=async()=>{
  return await redisClient.keys('*')
  .then(keys => {
    console.log('All keys in the database:');
    console.log(keys);
  })
  .catch(error => {
    console.error(`Error listing keys: ${error}`);
  })
}
export const getOrSetCache = async (key, cb) => {
  return await redisClient
    .get(key)
    .then(async (result) => {
      if (result != null) {
        console.log("data exist and result =>" + result);
        return JSON.parse(result);
      }
      const freshData = await cb();
      console.log("freshData =>" + freshData);
      redisClient.set(key,JSON.stringify(freshData), "EX", TTL);
      return freshData;
    })
    .catch((e) => console.log(e));
};

export const getAllKeys = async() => {
  return await redisClient.keys('*')
  .then( async keys => {
    // Iterate over keys and fetch values for each key
    const valuePromises = keys.map(key => redisClient.get(key));
    
    // Wait for all value fetch operations to complete
    return Promise.all(valuePromises)
      .then(values => {
        const keyValuePairs = keys.map((key, index) => ({
          key,
          value: values[index],
        }));
        
        console.log('All keys and values in the Redis database:');
        console.log(JSON.stringify(keyValuePairs));
      });
  })
  .catch(error => {
    console.error(`Error fetching keys and values: ${error}`);
  })
};
export const flushAll=async()=>{
  await redisClient.flushall()
  .then(() => {
    console.log('All values flushed successfully.');
  })
  .catch(error => {
    console.error(`Error flushing all values: ${error}`);
  })
}
