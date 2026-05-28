require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

//middleware to parse json data
app.use(express.json());

//middleware to parse cookies
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/user",userRouter);



//start the server and connect db
try {
    connectDB().then(() => {
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000");
        });
    });
} catch (error) {
    console.log(error);
}

