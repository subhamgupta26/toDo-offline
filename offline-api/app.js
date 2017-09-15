var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');
mongoose.connection.on('connected', () => {
	console.log('Connected to database ');
});

// On Error
mongoose.connection.on('error', (err) => {
	console.log('Database error: ' + err);
});

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// router.get('/', function (req, res) {
// 	res.json({ message: 'hooray! welcome to our api!' });
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.get('/test2',(req,res)=>{
  console.log("connected");
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.post('/save',function(req,res){ 
//   console.log("save called");
//   var user=req.body; 
//   var newuser=new Person({
//     title:user.title
//   })

//   newuser.save((err,Person)=>{
//     if(err){
//       console.log("error");
//     }
//   });
//   res.send("Succesfull");

// })
router.route('/test')
	.get((req, res) => {
    alert("blank called");
  });

 router.route('/save')
	.post((req, res) => { 
      console.log("save called");
  var user=req.body; 
  var newuser=new Person({
    title:user.title
  })

  newuser.save((err,Person)=>{
    if(err){
      console.log("error");
    }
  });
  res.send("Succesfull");
  });
app.use('/api', router);
app.listen(8200);
console.log('Server Running on port 8200');
module.exports = app;
