var express = require('express');
var router = express.Router();
const Clip = require('../models/Clip')
const verifyUser = require('../middleware/verifyUser')
const User = require('../models/User')

/* GET home page. */
router.get('/', verifyUser, async function(req, res, next) {
  let loggedIn = res.loggedIn
  let clips = await Clip.find({}).populate("creator")
  if(res.loggedIn = true){
  res.render('index', {clips, loggedIn});
  }
  else{
    res.render('index', {clips})
  }
});

module.exports = router;
