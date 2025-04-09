import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/fileupload.js";
import { ApiResponse } from "../utils/apiresponse.js";




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

    const {fullName,email,username,password}=req.body
    console.log("email:",email);


    // if(fullName===""){
    //     throw new ApiError(400,"FullName is required")
    // }  this way we can validate all the fields but we will require if statement for each field

    if (
        [fullName,email,username,password].some((field)=> field?.trim()==="")
    ) {
        throw new ApiError(400,"All Fields Are Required")
    }
 
    // check if user already exists or not
    const existeduser=User.findOne({
        $or : [{username},{email}]
    })
    if(existeduser)
    {
        throw new ApiError(409,"User Already Exists with same email or username")
    }

    // checking images and avatar
     const avatarlocalpath=req.files?.avatar[0]?.path;
     const coverimagelocalpath=req.files?.coverimage[0].path;

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
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

     // to check if user is created or not
    const createdUser=await User.findById(user._id).select(
        "-password -refreshtoken"
    ) 

    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )

})

export {registerUser}