import mongoose, { Schema } from "mongoose";

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
        coverimage:{
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
        refreshtoken:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)







export const User = mongoose.model(User,UserSchema);

