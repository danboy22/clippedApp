const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validator = require('validator')
const User = require('../models/User')
const Game = require('../models/Game')

const clipSchema = new Schema({
    clipName: {
        type: String,
        required: [true, "Clip Name is required."],
    },
    clipDescription: {
        type: String,
    },
    clipDate: {
        type: String,
        required: [true, "Clip Date is required"],
        validate: {
            validator: (val) => validator.isDate(val),
            message: "A valid date is required. Format is YYYY/MM/DD or YYYY-MM-DD"
        }
    },
    clipGame: {
        type: String,
        required: [true, "Clip Game is required."]
    },
    clipFile: {
        type: String,
        required: [true, "File is required."]
    },
    comments: {
        type: Array
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Clip = mongoose.model("Clip", clipSchema)

module.exports = Clip