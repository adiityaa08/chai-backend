import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,     // removes leading and trailing whitespaces
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,     
        },
        fullname:{
            type:String,
            required:true,
            trim:true,     
            index:true
        },
        avatar:{
            type:String,  //cloudinary url
            required:true,
        },
        coverImage:{
            type:String,    
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'Password required']
        },
        refreshToken:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)

UserSchema.pre("save",async function(next){
    // if(this.isModified("password")){
    //     this.password=bcrypt.hash(this.password,10)
    //     next()
    // }

    if(!this.isModified("password"))return next();

    this.password=await bcrypt.hash(this.password,10)
    next()
})

UserSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)   //bcrypt compare return true or false
    // bcrypt.compare takes one input as password from user and other is bcrypted password
}

UserSchema.methods.generateAccessToken=function(){
    return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

UserSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
    {
        _id:this._id   //it has less data since it gets refresh time to time
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
       expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}






export const User = mongoose.model("User",UserSchema);

