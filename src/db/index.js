import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDb = async () =>{
    try{
        const connectionInstace = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("mongoDb connected !! Db Host")
    }
    catch (error) {
        console.log(error)
        process.exit(1)
    }
}
export default connectDb