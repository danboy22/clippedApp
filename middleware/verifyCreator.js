const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Clip = require('../models/Clip')
// const validator = require('mongoose-validator')

async function verifyCreator(req, res, next) {
    let loggedIn = req.cookies.tokenLogin
    if (!loggedIn) {
        isMyClip = false
        res.isMyclip = false
        console.log("User is not logged in")
        next()
    }
    else {
        let user = await User.findById((jwt.decode(req.cookies.tokenLogin).id))
        let clip = await Clip.findById(req.params.id)
    
        //checks to see if the logged in users username matches creatorID of clip
        if(user._id = clip.creator) {
                res.isMyClip = true
                next()
            } else{
                res.isMyClip = false
                next()
            }
        }
}

module.exports = verifyCreator