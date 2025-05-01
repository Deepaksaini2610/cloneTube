import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = e();

app.use(
  e.json({
    limit: "16kb",
  })
);
app.use(cors());
app.use(
  e.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(e.static("public"));
app.use(cookieParser());

export { app };
