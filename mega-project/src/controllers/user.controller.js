import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    const {fullName, email, username, password} = req.body
    console.log(fullName, email, username, password);
    //validation - not empty
    // if (!fullName || !email || !username || !password) {
    //     throw new ApiError(400, "All field required")
    // }
    // 2nd approach
    if (
        [fullName, email, username, password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All field required")
    }
    //if user already exists: username, email

    User.findOne({
        $or: [{email}, {username}]
    }).then((user) => {
        if (user) {
            throw new ApiError(409, "User with email or username already exists")
        }
    })
    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; //avatarLocalPath is a string
    const coverImageLocalPath = req.files?.coverImage[0]?.path; //coverImageLocalPath is a string
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    //upload then to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file required")
    }
    //create user object - create entry in db
    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check for user creation
    if(createdUser){
        throw new ApiError(500, "Somethings went wrong while registration")
    }


    //return response
    return res.status(201).json(
        new ApiResponse(200, "User created successfully", createdUser)
    )
})


export {registerUser}