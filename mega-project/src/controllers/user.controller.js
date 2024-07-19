import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const { fullName, email, username, password } = req.body;
  //validation - not empty
  // if (!fullName || !email || !username || !password) {
  //     throw new ApiError(400, "All field required")
  // }
  // 2nd approach
  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All field required");
  }
  //if user already exists: username, email

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //check for images, check for avatar
//   const avatarLocalPath = req.files?.avatar[0]?.path; //occur error if avatar is not exist in req.files object because of undefined
//   const coverImageLocalPath = req.files?.coverImage[0]?.path;  //occur error if coverImage is not exist in req.files object because of undefined

  let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //upload then to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file required");
  }
  //create user object - create entry in db
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Somethings went wrong while registration");
  }

  //return response
  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
    // req body => data
    const { email, password, username } = req.body;
    if (!username || !email) {
        throw new ApiError(400, "username or email is required")
    }
    //username and email validation
    const user = await User.findOne({
        $or: [username, email]
    })
    //find the user
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    //password check
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }
    //access and refress token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    //update user with unwanted send password and refresh token
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //send cookies

    const options = {
        httpOnly: true,
        secure: true
    }
    res.cookie("accessToken", accessToken, options)
    res.cookie("refreshToken", refreshToken, options)
    //return response
    return res.status(200).json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully"))
})

export { registerUser, loginUser };