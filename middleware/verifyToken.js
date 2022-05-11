const bcrypt = require('bcrypt')
const User = require('../models/User')
const secret = process.env.SECRET
const jwt = require('jsonwebtoken')

async function verifyToken(req, res, next) {
    let { username, password } = req.body
    let token
    
    try{
        if (!username || !password) {
            return res.send("Please complete form")
        }

        let user
        user = await User.findOne({username: username})

        if(!user) {
            return res.send("Username not found!")
        }

        let passwordMatch
        passwordMatch = await bcrypt.compareSync(password, user.password)
        if (!passwordMatch) {
            return res.send("Password not a match!")
        }

        token = jwt.sign({id: user._id}, secret)
        res.cookie("tokenLogin", token)

    }
    catch (error) {
        res.status(500).json({error: error.message})
    }
    res.token = token
    next()
}

module.exports = verifyToken