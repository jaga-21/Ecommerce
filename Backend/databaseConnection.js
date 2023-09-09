import mysql2 from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const  connection = mysql2.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
})


const isConnected=()=>{
    try{
        connection.connect()
        console.log("connected to sql")
    }
    catch(e){
        console.log(e.message)
    }
}

const DBfuncs={
    isConnected,
    connection
}
export default DBfuncs;