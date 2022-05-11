const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validator = require('validator')

const userSchema = new Schema({
    
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: [true, "Sorry, this username is already taken."],
        minlength: [3, "Username must contain at least 3 characters."] 
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [3, "Password must be at least 3 characters."],
        validate: {
            validator: (val) => validator.isStrongPassword(val),
            message: "Password must contain: 8 characters, 1 uppercase letter, 1 lowercase leter, 1 number, and 1 symbol."
        } 
    },
    emailAddress: {
        type: String,
        // required: [true, "Email address is required."],
        // unique: [true, "Email address is already linked to an account."],
        // validate: {
        //     validator: (val) => validator.isEmail(val),
        //     message: "Email address must be valid."
        // }
    },
    profilePic: {
        type: String
    },
    age: {
        type: Number
    },
    location: {
        type: String
    },
    bio: {
        type: String,
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User