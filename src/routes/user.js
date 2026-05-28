const express = require("express");
const userRouter = express.Router();
const { userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/requests/received",userAuth,async (req,res)=>{
    try{
        const loggedinuser = req.user;
         const pendingRequests = await ConnectionRequest.find({toUserId:loggedinuser._id,status:"interested"}).populate("fromUserId","firstName lastName");
        res.json({message:"Pending requests fetched successfully",pendingRequests:pendingRequests});
    }catch(error){
        res.status(400).send("USER ERROR: "+ error.message);
    }
});


//api to get the list of users who are connected to the loggedin user
//loggedinuser should be from userid or touserid and status should be accepted.
userRouter.get("/requests/connected",userAuth,async (req,res)=>{
    try{
        const loggedinuser = req.user;
        const SAFE_FIELDS = "firstName lastName photoUrl age gender about skills";

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinuser._id },
                { toUserId: loggedinuser._id },
            ],
            status: "accepted",
        })
            .populate("fromUserId", SAFE_FIELDS)
            .populate("toUserId", SAFE_FIELDS);

        const data = connections.map((conn) => {
            if (conn.fromUserId._id.toString() === loggedinuser._id.toString()) {
                return conn.toUserId;
            }
            return conn.fromUserId;
        });

        res.json({ message: "Connected users fetched successfully", data });
    }catch(error){
        res.status(400).send("USER ERROR: "+ error.message);
    }
});

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedinuser = req.user;
        const {page=1,limit=10} = req.query;
        const skip = (page-1)*limit;


        const SAFE_FIELDS = "firstName lastName photoUrl age gender about skills";
        const connectionRequests = await ConnectionRequest.find({$or:[{fromUserId:loggedinuser._id},{toUserId:loggedinuser._id}]}).select("fromUserId toUserId")
        const hiddenUsers = new Set();
        connectionRequests.forEach(request=>{
            hiddenUsers.add(request.fromUserId.toString());
            hiddenUsers.add(request.toUserId.toString());
        });
        hiddenUsers.add(loggedinuser._id.toString());
        const users = await User.find({_id:{$nin:Array.from(hiddenUsers)}}).select(SAFE_FIELDS).skip(skip).limit(limit);
        res.json({message:"Feed fetched successfully",users:users});
    }
    catch(error){
        res.status(400).send("USER ERROR: "+ error.message);
    }
});

module.exports = userRouter;