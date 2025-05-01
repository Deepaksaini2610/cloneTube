import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("error", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log("server is running at port no.", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("mongodb connection failure !!!", error);
  });
