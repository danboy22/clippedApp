const express = require('express');
const router = express.Router();
const User = require("../models/User")
const Clip = require("../models/Clip")
const verifyUser = require('../middleware/verifyUser')

//GET MY PROFILE PAGE
router.get('/:id', verifyUser, async function(req, res, next) {
    let loggedIn = res.loggedIn
    let user = await User.findById(req.params.id)
    let clips = await Clip.find({creator: req.params.id}).populate('creator')
    if(res.loggedIn = true) {
        res.render('creator', {user, clips, loggedIn})
      }
    else{
        res.render('creator', {user, clips})
    }
})

module.exports = router