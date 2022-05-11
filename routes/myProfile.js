const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Clip = require("../models/Clip");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const verifyUser = require("../middleware/verifyUser");
const verifyCreator = require("../middleware/verifyCreator");
// const multer = require("multer")

// const upload = multer({ dest: "public/uploadsPics/" })

//GET MY PROFILE PAGE
router.get("/", verifyUser, async function (req, res, next) {
  let loggedIn = res.loggedIn;
  let userId = await jwt.decode(req.cookies.tokenLogin).id;
  let user = await User.findById(userId);
  let clips = await Clip.find({ creator: userId });
  if ((res.loggedIn = true)) {
    res.render("myProfilePage", { user, clips, loggedIn });
  } else {
    res.render("myProfilePage", { user, clips });
  }
});

//GET EDIT PROFILE PAGE
router.get("/edit", verifyUser, async function (req, res, next) {
  let loggedIn = res.loggedIn;
  let userId = await jwt.decode(req.cookies.tokenLogin).id;
  let user = await User.findById(userId);

  if ((res.loggedIn = true)) {
    res.render("myProfileEdit", { user, loggedIn });
  } else {
    res.render("myProfileEdit", { user });
  }
});

//POST EDIT PROFILE PAGE
router.post("/edit", async function (req, res, next) {
  let userId = await jwt.decode(req.cookies.tokenLogin).id;
  let user = await User.findById(userId);

  if (!req.files) {
    await User.findByIdAndUpdate(userId, {
      emailAddress: req.body.emailAddress,
      age: req.body.age,
      location: req.body.location,
      bio: req.body.bio,
    });

  } else {
    // SAVE IMAGE FILE
    let sampleFile;
    let uploadPath;

    // the name of the input filed ("sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.profilePic;
    uploadPath = "public/images/" + sampleFile.name;

    // use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
      console.log("File was uploaded");
    });

    await User.findByIdAndUpdate(userId, {
      emailAddress: req.body.emailAddress,
      profilePic: sampleFile.name,
      age: req.body.age,
      location: req.body.location,
      bio: req.body.bio,
    });
  }
//   res.render("myProfilePage", { user });
res.redirect('/myProfile')
});

module.exports = router;
