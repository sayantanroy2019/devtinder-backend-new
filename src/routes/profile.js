const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/view",userAuth,async (req,res) => {
    try {
        
        res.send(req.user);
    }catch (error) {
        res.status(400).send("PROFILE ERROR: "+ error.message);
    }
});

profileRouter.patch("/edit",userAuth,async (req,res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("This field cannot be updated");
        }else{
            const loggedinuser = req.user;
            Object.keys(req.body).forEach(key => {
                loggedinuser[key] = req.body[key];
            });
            await loggedinuser.save();
            res.json({message:"Profile updated successfully",user:loggedinuser});
        }
    }catch (error) {
        res.status(400).send("PROFILE ERROR: "+ error.message);
    }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw new Error("Old password and new password are required");
        }

        const user = req.user;

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new Error("Old password is incorrect");
        }

        if (oldPassword === newPassword) {
            throw new Error("New password must be different from old password");
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("New password is not strong enough");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.clearCookie("token", { httpOnly: true, secure: true });
        res.json({ message: "Password updated successfully. Please log in again." });
    } catch (error) {
        res.status(400).send("PASSWORD ERROR: " + error.message);
    }
});

module.exports = profileRouter;