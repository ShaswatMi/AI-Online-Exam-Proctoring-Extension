import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens= async(userId)=>{
    const user= await User.findById(userId)
    const accessToken =user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken= refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
}

const registerUser= asyncHandler ( async (req,res)=>{
    const {name,email,password,userType}=req.body
    
    if(!name || !email || !password || !userType)
    {
        throw new ApiError(400,"All fields are required")
    }
    
    const existingUser= await User.findOne({email})
    if(existingUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    const user= await User.create({
        name,
        email,
        password,
        userType
    })
    const createdUser= await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registerd successfully")
    )
})

const loginUser = asyncHandler ( async(req,res)=>{
    const {email,password} = req.body 

    if(!email){
        throw new ApiError(400,"Email is required")
    }

    const user= await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid= await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Password")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged In successfully"
        )
    )
})

const logoutUser= asyncHandler ( async (req,res)=>{
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

    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))

})

export {registerUser,
        loginUser ,
        logoutUser,      
}