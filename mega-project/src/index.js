// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})

const port = process.env.PORT || 8000


connectDB()
.then(port,()=> {
    app.on("error", (error) => {
        console.log("Error:", error);
        throw error
    });
    app.listen(()=>{
    console.log(`Server is running at port: ${port}`);
    })
})
.catch((error)=> {
    console.log('MongoDb connection failed !!',error);
})


































/*
import express from "express"
const app = express();
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("Error:", error);
            throw error
        })

        app.listen(process.env.PORT, ()=> {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error:", error);
        throw error
    }
})()

*/