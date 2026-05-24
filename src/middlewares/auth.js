const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token not found");
        }
        const decodedMessage = jwt.verify(token,process.env.JWT_SECRET);
        const userId = decodedMessage.userId;
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }catch (error) {
        res.status(400).send("AUTH ERROR: "+ error.message);
    }
}

module.exports = {
    userAuth
}