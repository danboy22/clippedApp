const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const saltRounds = +process.env.SALT
const User = require('../models/User')
const path = require('path')
const verifyToken = require('../middleware/verifyToken')
const fs = require('fs')
const multer = require('multer')
const verifyUser = require('../middleware/verifyUser')
const { default: isStrongPassword } = require("validator/lib/isStrongPassword");

// const upload = multer({ dest: "public/uploadsPics/" })


/* GET register page. */
router.get('/register', verifyUser, function(req, res, next) {
  let loggedIn = res.loggedIn
  if(res.loggedIn = true) {
    res.render('usersRegister', {loggedIn})
  }
  else {
    res.render('usersRegister')
  }
});

//POST create new user
router.post('/register', async function(req, res, next) {
  if (req.body.username == "" || req.body.password == "") {
    res.send("Username and Password required.");
  }
  const tempUser = await User.findOne({ username: req.body.username });
  if (tempUser) {
     res.send("This username is taken.");
  }
  const tempUser2 = await User.findOne({ emailAddress: req.body.emailAddress})
  if(tempUser2) {
    res.send("This email address is already linked to an account.")
  }
  let validPassword = isStrongPassword(req.body.password)
  if (validPassword === false) {
    res.send("Password must contain 8 characters including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.")
  }
  if (req.body.password != req.body.repeatPassword) {
    res.send("Passwords dont match.");
  }
  else {
    if( !req.files) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        emailAddress: req.body.emailAddress,
        age: req.body.age,
        location: req.body.location,
        bio: req.body.bio
      });

      newUser.save()
      res.redirect("/users/login")
    }
    else {
      sampleFile = req.files.profilePic;
      uploadPath = "public/images/" + sampleFile.name
    
        // use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function (err) {
          if (err) return res.status(500).send(err);
          console.log("File was uploaded");
        });
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        emailAddress: req.body.emailAddress,
        profilePic: sampleFile.name,
        age: req.body.age,
        location: req.body.location,
        bio: req.body.bio
      });

      newUser.save()
      res.redirect("/users/login")
    }
    }
  })

//GET login page
router.get('/login', verifyUser, function(req, res, next) {
  let loggedIn = res.loggedIn
  if(res.loggedIn = true) {
    res.render('usersLogin', {loggedIn})
  }
  else{
   res.render('usersLogin')
  }
})

//POST login page
router.post("/login", verifyToken, async (req, res, next) => {
  res.redirect('/')
}) 

//GET LOGOUT
router.get('/logout', function (req, res, next) {
  res.clearCookie('tokenLogin')
  res.redirect('/')
})

//GET PROFILE PAGE

//GET EDIT PROFILE PAGE

//POST EDIT PROFILE PAGE 

module.exports = router;
