import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())  // use method is oftenly used for middlewares. We can set the limit of json by using limit:"16kb"
app.use(express.urlencoded()) // url encoded when we send any url it uses special characters for that it is used.
app.use(express.static("public"))
app.use(cookieParser())




export default app