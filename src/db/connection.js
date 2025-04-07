import mongoose from "mongoose";
import { db_name } from "../constants.js";

const connectdb=async ()=>{
    try{
        const connected=await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`)
        // console.log(connected);
        console.log(`MONGODB CONNECTED !! DB HOST:${connected.connection.host}`);
        return connected;
        // console.log(connected.connection.host)
    }
    catch(error){
        console.log("MONGODB CONNECTION ERROR",error);
        process.exit(1);
    }
}

export default connectdb;