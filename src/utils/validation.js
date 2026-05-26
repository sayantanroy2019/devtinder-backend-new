const validator = require('validator');

const validatesignupdata = (data) => {
    const {firstName,lastName,email,password} = data;
    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are required");
    }
    if(!validator.isEmail(email)){
        throw new Error("Invalid email");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
}

const validateEditProfileData = (req) => {
    isAllowedToUpdate = ["firstName","lastName","email","age","gender","photoUrl","about","skills"];
        Object.keys(req.body).forEach(key => {
            if(!isAllowedToUpdate.includes(key)){
                return false;
            }
        });
        return true;
};

module.exports = { validatesignupdata, validateEditProfileData };