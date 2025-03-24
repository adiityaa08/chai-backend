// require('dotenv').config({path:"./env"})

// import mongoose from 'mongoose';
// import {db_name} from "./constants.js"
import dotenv from "dotenv"
import connectdb from "./db/connection.js"

dotenv.config({
    path:"./env"
})

connectdb() // we have used async and await function so it returns a promise so to handle it we use then-catch
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`server started at port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Mongodb connection failed")
})