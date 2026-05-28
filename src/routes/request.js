const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");


requestRouter.post("/send/:status/:userId",userAuth,async (req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        if(status !== "interested" && status !== "ignored"){
            throw new Error("Invalid status");
        }
        if(fromUserId.toString() === toUserId.toString()){
            throw new Error("You cannot send a connection request to yourself");
        }
        const existingRequest = await ConnectionRequest.findOne(
            {$or:[{fromUserId:fromUserId,toUserId:toUserId},{fromUserId:toUserId,toUserId:fromUserId}]});
        if(existingRequest){
            throw new Error("Connection request already exists");
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({message:"Connection request sent successfully",connectionRequest:data}); 
    }catch (error) {
        res.status(400).send("REQUEST ERROR: "+ error.message);
    }
});


requestRouter.post("/review/:status/:requestId",userAuth,async (req,res)=>{
    try{
        const loggedinuser = req.user;
        const {status,requestId} = req.params;
        const allowedStatuses = ["accepted","rejected"];
        if(!allowedStatuses.includes(status)){
            throw new error ("Invalid status");
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedinuser._id,
            status:"interested"
        })
        if(!connectionRequest){
            throw new error ("Connection request not found");
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.json({message:"Connection request reviewed and " + status + " successfully",connectionRequest:connectionRequest});



    }catch(error){
        res.status(400).send("REQUEST ERROR: "+ error.message);
    }
})
module.exports = requestRouter;