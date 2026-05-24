const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

requestRouter.post("/send/interested/:userId",userAuth,async (req,res) => {
    try {
        res.send(req.user.firstName + " sent interested connection request to " + req.params.userId);
    }catch (error) {
        res.status(400).send("REQUEST ERROR: "+ error.message);
    }
});

module.exports = requestRouter;