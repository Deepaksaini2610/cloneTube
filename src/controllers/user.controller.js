import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt  from 'jsonwebtoken'





const gernerateAccessAndRefrestTokens = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const refreshToken = user.generateRefreshToken();
    const AccessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { AccessToken, refreshToken };
  } catch (err) {
    throw new apiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  console.log(email, password);
  const exitingEmail = await User.findOne({ email });
  if (exitingEmail) {
    throw new apiError(409, "user with this email already existes");
  }
  const existingUserName = User.findOne({ userName });
  if (existingUserName) {
    throw new apiError(409, "user with this email already existes");
  }

  const newUser = await User.create({
    userName,
    email,
  });
  newUser.save();
  res.status(201).json({
    message: "user registered",
    id: newUser_id,
  });
  //    const findData = await User.find({
  //     email:email,
  //     password:password

  //    })
  //    if(findData){
  //     throw new apiError[409,"User with email or username already exist"]
  //    }
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body = data
  // find user by user model
  // check password
  // access and refresh token
  // send cookies
  const { userName, email, password } = req.body;
  if (!userName || !email) {
    throw new apiError(400, "username or password is required");
  }
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) {
    throw apiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials");
  }
  const { AccessToken, refreshToken } = await gernerateAccessAndRefrestTokens(
    user._id
  );

  const loggedInUser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
  .status(200)
  .cookie("accessToken",AccessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse (
        200,
        {
            user:loggedInUser,AccessToken,refreshToken
        },
        "user logged in successfully"
    )
  )
});





const logOutUser = asyncHandler (async (req,res) =>{
  
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
    secure: true,
  };
  
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"));
  
  
})


const refreshAccessToken = asyncHandler (async(req,res)=>{
   const incomingRefreshToken =  req.cookies?.refreshToken || req.body.refreshToken

 const decodeToken =   jwt.verify(incomingRefreshToken, process.env.REFERESH_TOKEN_SECRET)

  const user = await User.findById(decodeToken?._id)
  if(!user ){
    throw new apiError(401,"Invalid refresh token")
  }
  const {AccessToken,newRefreshToken}  = await gernerateAccessAndRefrestTokens(user._id)
  
  
  const options = {
    httpOnly:true,
    secure:true

  }
  return res
  .status(200)
  .cookie("accessToken",AccessToken,options)
  .cooke("refreshToken",newRefreshToken,options)
  .json(new ApiResponse(200,{AccessToken,refreshToken:newRefreshToken},"acces token refreshed"))


})

const changePassword = asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword} = req.body
    const user = await User.findById( req.user?._id)  
    if(!user){
      throw new apiError(400,"user not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
      throw new apiError(400,"invalid old password")
    }
    user.password = newPassword
    await user.save(({validateBeforeSave:false}))

    return res.status(200)
    .json(new ApiResponse(200,{},"password change successfully"))

})





export { registerUser,loginUser,logOutUser,changePassword };
