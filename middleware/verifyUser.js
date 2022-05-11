const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

function verifyUser(req, res, next) {
    let userLoggedIn
    //checks to see if there is a cookie
    if(!req.cookies.tokenLogin) {
        userLoggedIn = false
        res.loggedIn = false
        next()
    }
    else {
        userLoggedIn = jwt.verify(req.cookies.tokenLogin, secret) // checking for valid JWT
            if(!userLoggedIn) {
                res.loggedIn = false
                next()
            }
            else {
                res.loggedIn = true
                next()
            }
    }   
}

module.exports = verifyUser