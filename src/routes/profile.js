const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

profileRouter.get("/profile/view",userAuth,async (req,res) => {
    try {
        
        res.send(req.user);
    }catch (error) {
        res.status(400).send("PROFILE ERROR: "+ error.message);
    }
});

module.exports = profileRouter;