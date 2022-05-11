const express = require('express');
const router = express.Router();
const User = require("../models/User")
const Clip = require("../models/Clip")
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const fs = require("fs")
const verifyUser = require('../middleware/verifyUser')
const verifyCreator = require('../middleware/verifyCreator')

router.get('/:id', [verifyUser, verifyCreator], async function (req, res, next) {
    let loggedIn = res.loggedIn
    const clip = await Clip.findById(req.params.id).populate("creator")

    if(res.loggedIn = true){
        let isMyClip = res.isMyClip

        if(res.isMyClip = false){
            res.render('clip', {clip, loggedIn})
        }
        else{
            res.render('clip', {clip, loggedIn, isMyClip})
        }
      }

    else {
    res.render("clip", {clip})
    }
})

//post new comment on clip
// router.post('/:id', async function(req, res, next) {
    
//     const clip = await Clip.findById(req.params.id)
//     const user = await User.findById(jwt.decode(req.cookies.tokenLogin).id)
//     let clipComments = clip.comments
//     let newComment = `${user.username}: ${req.body.newComment}`
//     clipComments.push(newComment)
//     await clip.update({
//         comments: clipComments
//     })
//     res.redirect('/')

// })

// get clip edit page
router.get('/edit/:id', [verifyUser, verifyCreator], async function(req, res, next) {
    let loggedIn = res.loggedIn
    const clip =  await Clip.findById(req.params.id).populate("creator")
    if(!res.loggedIn || !res.isMyClip){
        res.redirect('/clip/:id')
    }
    else{
        res.render('clipEdit', {clip, loggedIn})
    }
})

router.post('/edit/:id', async function(req, res) {

        await Clip.findByIdAndUpdate(req.params.id, {
            clipName: req.body.clipName,
            clipDescription: req.body.clipDescription
        })

        res.redirect(`/clip/${req.params.id}`)

})

// GET DELETE CLIP

router.get('/delete/:id', async function(req, res, next) {
    let clip = await Clip.findById(req.params.id)

    await Clip.findByIdAndDelete(req.params.id)
    fs.unlink(("public/clips/" + clip.clipFile), function(err){
        if(err) throw(err)
        console.log('Clip Deleted')
    })
    res.redirect('/')
})

module.exports = router