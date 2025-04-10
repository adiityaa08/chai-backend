import { ApiError } from "../utils/apiErrors";
import { asyncHandler } from "../utils/asynchandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT=asyncHandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if (!token) {
            throw new ApiError(401,"Unauthorized request")
        }
    
       const decodedtoken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
       const user=await User.findById(decodedtoken?._id).select("-password -refreshToken")
       if(!user)
       {
        throw new ApiError(401,"invalid access token")
       }
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "inavlid access token")
    }
})