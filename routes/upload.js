const express = require("express");
const router = express.Router();
const User = require("../models/User");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Clip = require("../models/Clip");
const verifyUser = require("../middleware/verifyUser");
const { default: isDate } = require("validator/lib/isDate");

/* GET upload page. */
router.get("/", verifyUser, function (req, res, next) {
  let loggedIn = res.loggedIn;
  if ((res.loggedIn = true)) {
    res.render("upload", { loggedIn });
  } else {
    res.render("upload");
  }
});

//POST upload new clip

router.post("/", async function (req, res, next) {
  if (!req.body.clipName){
    res.send("Clip Name is required.")
  }
  if (!req.body.clipDate) {
    res.send("Clip Date is required.")
  }
  let clipDateValid = isDate(req.body.clipDate)
  if (clipDateValid === false){
    res.send("Clip Date must be in valid format. Format is YYYY/MM/DD or YYYY-MM-DD")
  }
  if (!req.body.clipGame){ 
    res.send("Clip Game is required.")
  }
  if (!req.files){
    res.send("Clip File is required.")
  }

  // SAVE Clip FILE
  let sampleClip;
  let uploadPath;
  let creatorId = await jwt.decode(req.cookies.tokenLogin).id;
  let creator = await User.findById(creatorId);

  // the name of the input filed ("sampleClip") is used to retrieve the uploaded file
  sampleClip = req.files.clipFile;
  uploadPath = "public/clips/" + sampleClip.name;

  // use the mv() method to place the file somewhere on your server
  sampleClip.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    console.log("File was uploaded");
  });

  let newClip = new Clip({
    clipName: req.body.clipName,
    clipDescription: req.body.clipDescription,
    clipDate: req.body.clipDate,
    clipGame: req.body.clipGame,
    clipFile: sampleClip.name,
    creator: creator,
  });

  newClip.save();
  res.redirect('/myProfile')
});

module.exports = router;
