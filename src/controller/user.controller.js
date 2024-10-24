import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {

    //get user detail from frontend 
    //validation  of user detail
    //check  if  user already exist in database  username, email
    //check for  image and avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db 
    //remove password and refresh token field from response
    //check for user creation 
    //return res

    const { fullname, username, email, password } = req.body
    console.log("email: ", email);
    if (
        [fullname, username, email, password].some((field) => 
            field?.trim () === "" )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser = User.findOne({
        $or: [{ username }, { email } ]
    })  
    if (existedUser) {
        throw new ApiError(409, "User with  this username or email already exist");
    }
    const avatarLocalPath = req.file?.avatar[0]?.path;
    const coverImageLocalPath = req.file?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new  ApiError(400, "Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar upload  failed")
    }
    const user = User.create({
        fullname,
        username: username.toLowercase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new error(500, 'Something went wrong while registering user.')
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered successfully ")
    )
});

export { registerUser };
