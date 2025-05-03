import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { jwt } from "jsonwebtoken";



const verifyJWT = asyncHandler(async (req,res,next)=>{
           try {
             const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","")
             if(!token){
                 throw new apiError(401,"UnAuthorized request")
             }
             const decodeToken = jwt.verify(
               token,
               process.env.ACCESS_TOKEN_SECRET
             );
             const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
 
             req.user = user
             next()
           } catch (error) {
                throw new apiError(401,error?.message || "Invali Access Token")
           }
})
export {verifyJWT}