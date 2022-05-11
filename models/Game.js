const mongoose = require("mongoose")
const Schema = mongoose.Schema

const gameSchema = new Schema({
    gameName: {
        type: String,
        required: [true, "Game Name is required."],
    },
    gameImage: {
        type: String
    },
    gameDescription: {
        type: String,
        required: [true, "Game Description is required."]
    },
})

const Game = mongoose.model("Game", gameSchema)

module.exports = Game