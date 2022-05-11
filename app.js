require("dotenv").config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const hbs = require('hbs')
const bcrypt = require('bcrypt')
const fs = require('fs')
const multer = require("multer")
const fileUpload = require("express-fileupload")

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const myProfileRouter = require('./routes/myProfile')
const uploadRouter = require('./routes/upload')
const clipRouter = require('./routes/clip')
const creatorRouter = require('./routes/creator')

const app = express();

//Mongo DB Connection
mongoose.connect(process.env.DB_URI, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// //SET STORAGE
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// const upload = multer({storage: storage})


// register partials
hbs.registerPartials(path.join(__dirname + "/views/partials"))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload({
  createParentPath: true
}))

// use bootstrap for css
// app.use('/stylesheets', express.static(path.join(__dirname, + '/node_modules/bootstrap/dist/css')));

//use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/myProfile', myProfileRouter)
app.use('/upload', uploadRouter)
app.use('/clip', clipRouter)
app.use('/creator', creatorRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
