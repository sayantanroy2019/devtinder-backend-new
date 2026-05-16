require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();


//middleware to parse json data
app.use(express.json());

//signup new user
app.post("/signup", async (req, res) => {


    
    const user = new User(req.body);


    try {
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(500).send("Internal server error");
    }

   
});

//get user by email
app.get("/user",async (req,res) => {
    try {
        const users = await User.find({email: req.body.email});
        if(!users){
            return res.status(400).send("User not found");
        }
        res.send(users);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

//get all users
app.get("/feed",async (req,res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

//delete user by userId
app.delete("/user",async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        if(!user){
            return res.status(400).send("User not found");
        }
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

//find by id and update the data of the user
app.patch("/user",async (req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body.userId,req.body,{runValidators:true});
        if(!user){
            return res.status(400).send("User not found");
        }
        res.send("User updated successfully");
        
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

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

