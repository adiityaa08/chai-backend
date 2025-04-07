// require('dotenv').config({path:"./env"})

// import mongoose from 'mongoose';
// import {db_name} from "./constants.js"
import dotenv from "dotenv";
import connectdb from "./db/connection.js";
import {app} from "./app.js";

dotenv.config({
  path: "./.env",
});

connectdb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server started at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed", error); // Will only run if there’s a real failure
  });
