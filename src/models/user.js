const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20
        },
        lastName: {
            type: String,
            minlength: 3,
            maxlength: 20
        },
       
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email address: " + value);
                }
            }
        }
        , password:{
            type: String,
            required: true
        },
         age: {
            type: Number,
            required: true,
            min: 18
        },
        gender: {
            type: String,
            required: true,
            validate(value){
               if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
               }
            }
        },
        photoUrl: {
            type: String,
           
        },
        about: {
            type: String,
            default: "This is a default about the user"
           
        },
        skills: {
            type: [String],
           
        }
    },{
        timestamps: true
    }   
);

const User = mongoose.model('User', userSchema);

module.exports = User;