const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validatesignupdata } = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {

    try {
        //validate the data
      validatesignupdata(req.body);
      


        //Encrypt the password
        const {firstName,lastName,email,password,age,gender,photoUrl,about,skills} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

      const user = new User({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        age,
        gender,
        photoUrl,
        about,
        skills
      });


    
      await user.save();
      res.send("User created successfully");
    } catch (error) {
        res.status(500).send("SIGNUP ERROR: "+ error.message);
    }

   
});

authRouter.post("/login", async (req,res) => {
    try {
        const {email,password} = req.body;
        //validate email is present in DB or not
        const user = await User.findOne({email});


        if(!user){
            throw new Error("User not found");
        }
        //validate password
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            throw new Error("Invalid password");
        }else{
            //create a JWT token    
            const token = await user.getJWTToken();

            //send the token to the user in a cookie
            res.cookie("token",token,{httpOnly:true,secure:true,maxAge:30*24*60*60*1000});
            res.send(user);

        }
        

    }catch (error) {
        res.status(400).send("LOGIN ERROR: "+ error.message);
    }
});

authRouter.post("/logout", async (req,res) => {
    try {

        //expire the token
        res.cookie("token","",{expires:new Date(Date.now())});
        res.send("Logout successful");

    } catch (error) {
        res.status(400).send("LOGOUT ERROR: "+ error.message);
    }
});

module.exports = authRouter;