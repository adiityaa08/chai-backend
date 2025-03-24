// require('dotenv').config({path:"./env"})

// import mongoose from 'mongoose';
// import {db_name} from "./constants.js"
import dotenv from "dotenv"
import connectdb from "./db/connection.js"

dotenv.config({
    path:"./env"
})

connectdb()
