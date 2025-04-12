import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/fileupload.js";
import { ApiResponse } from "../utils/apiresponse.js";
import jwt from"jsonwebtoken";

const generaterefreshandaccesstoken=async (userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and referesh token")
    }
}

    const registerUser=asyncHandler( async(req,res)=>{
    // steps for registering user 
    // get details form frontend
    // validation- non empty
    // check if user already exists or not: username,email
    // check for images and avatar
    // upload them to cloudinary , avatar
    // create user object - entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res

    const {fullname,email,username,password}=req.body
    console.log("email:",email , "fullname:",fullname ,"username:",username
    );


    // if(fullName===""){
    //     throw new ApiError(400,"FullName is required")
    // }  this way we can validate all the fields but we will require if statement for each field

    if (
        [fullname,email,username,password].some((field)=> field?.trim()==="")
    ) {
        throw new ApiError(400,"All Fields Are Required")
    }
 
    // check if user already exists or not
    const existeduser=await User.findOne({
        $or : [{username},{email}]
    })
    if(existeduser)
    {
        throw new ApiError(409,"User Already Exists with same email or username")
    }

    // checking images and avatar
     const avatarlocalpath=req.files?.avatar[0]?.path;
    //  const coverimagelocalpath=req.files?.coverImage[0].path;

    // checking if cover image is uploaded or not and it not then it must return null
    let coverimagelocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
    {
        coverimagelocalpath=req.files.coverImage[0].path;
    }

     if(!avatarlocalpath)
     {
        throw new ApiError(400,"Avatar image is required")
     }
     
     //upload on cloudinary

     const avatar=await uploadonCloudinary(avatarlocalpath);
     const coverImage=await uploadonCloudinary(coverimagelocalpath);
    
    if(!avatar)
    {
         throw new ApiError(400,"Avatar file is required")
    }

    const user=await User.create({ //create user object - entry in db
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

     // to check if user is created or not
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    ) 

    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
    })


    const loginUser=asyncHandler(async(req,res)=>{
      //req body->data
      //check using username or email
      //find user in db
      // password check
      //access and refresh token
      // send cookie

      const {email,username,password}=req.body
      if(!username && !email)
      {
        throw new ApiError(400,"username or email required")
      }


      //find user in db
     const user=await User.findOne({
        $or:[{username},{email}]
      })

      if(!user)
      {
        throw new ApiError(404,"user does not exist")
      }
       // if user found then password check
      const ispasswordvalid=await user.isPasswordCorrect(password)
      if(!ispasswordvalid)
      {
          throw new ApiError(401,"Invalid User Credentials")
      }

      const {accessToken,refreshToken}=await generaterefreshandaccesstoken(user._id)

      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


      const options = {
        httpOnly: true,
        secure: true
     }

     return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
    })

   
    const logOutUser=asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken:undefined
                }
            },
            {
                new:true          
            }
        )
        const options = {
            httpOnly: true,
            secure: true
         }
         return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
         .json(new ApiResponse(200,{},"User Logged out"))
    })

    const refreshAccesstoken=asyncHandler(async(req,res)=>{
        const incomingrefreshtoken=req.cookies.refreshToken || req.body.refreshToken
        if (!incomingrefreshtoken) {
            throw new ApiError(401, "unauthorized request")
        }

        try {
            const decodedtoken=jwt.verify(refreshAccesstoken,REFRESH_TOKEN_SECRET)
    
            const user=await User.findById(decodedtoken?._id)
            if (!user) {
                throw new ApiError(401, "invalid refresh token")
            }
            if(refreshAccesstoken !== user?.refreshToken)
            {
                throw new ApiError(400,"Refresh token is expired or used")
            }
    
            const options={
                httpOnly:true,
                secure:true
            }
    
            const {accessToken,NewrefreshToken}=await generaterefreshandaccesstoken(user._id)
    
            return res.status(200).cookie("accesstoken",accessToken,options)
            .cookie("refreshToken",NewrefreshToken,options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,refreshToken:NewrefreshToken
                    },"Access Token refreshed"
                )
            )
        } catch (error) {
            throw new ApiError(401,error?.message || "Invalid refresh token")
        }
    })

    const changeuserpassword=asyncHandler(async(req,res)=>{
        const {oldpassword,newpassword}=req.body

       const user= await User.findById(req.user?._id)

       const isPasswordCorrect=await user.isPasswordCorrect(oldpassword)

       if(!isPasswordCorrect)
       {
        throw new ApiError(400,"Invalid Old Password")
       }

       user.password=newpassword
       await user.save({validateBeforeSave:false})

       return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))
    })

    const getcurrentuser=asyncHandler(async(req,res)=>{
        res.status(200).json(new ApiResponse(200,req.user,"User fetched successfully"))
    })

    const updateuserdetails=asyncHandler(async(req,res)=>{
        const{fullname,email}=req.body
        if(!fullname || !email)
        {
            throw new ApiError(400,"Fullname and email required")
        }

        const user=await User.findByIdAndUpdate(
            req.user?._id,
        {
            $set:{
                fullname,
                email:email
            }
        },
        {new:true}
        ).select("-password")

        return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))
    })

    const updateuseravatar=asyncHandler(async(req,res)=>{
        const avatarlocalpath=req.file?.path // get avatar file path 
        if(!avatarlocalpath)
        {
            throw new ApiError(400,"Avatar file is missing")
        }
        const avatar=await uploadonCloudinary(avatarlocalpath)//file uploaded on cloudinary (here we get object from cloudinary) and we get url

        if(!avatar.url)// if url is not found then return api error
        {
            throw new ApiError(400,"error while uploading on avatar")
        }

        const user=await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    avatar:avatar.url
                }
            },
            {new:true}
        ).select("-password")
        return res.status(200).json(new ApiResponse(200,user,"avatar updated successfully"))
    })

    const updateusercoverimage=asyncHandler(async(req,res)=>{
        const coverimagelocalpath=req.file?.path // get avatar file path 
        if(!coverimagelocalpath)
        {
            throw new ApiError(400,"cover image file is missing")
        }
        const coverImage=await uploadonCloudinary(coverimagelocalpath)//file uploaded on cloudinary (here we get object from cloudinary) and we get url

        if(!coverImage.url)// if url is not found then return api error
        {
            throw new ApiError(400,"error while uploading on cover image")
        }

       const user= await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    coverImage:coverImage.url
                }
            },
            {new:true}
        ).select("-password")
        
        return res.status(200).json(new ApiResponse(200,user,"Coverimage updated successfully"))
    })
export {registerUser,loginUser,logOutUser,refreshAccesstoken,changeuserpassword,getcurrentuser,updateuserdetails,updateuseravatar,updateusercoverimage}