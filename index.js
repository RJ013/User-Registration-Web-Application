var express = require('express');
var dotenv = require('dotenv').config();
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');

// Create an Express application
var app = express();



// Connect to MongoDB
mongoose
  .connect('mongodb+srv://auth:qwertyuiop@cluster0.3f6wpmj.mongodb.net/Auth?retryWrites=true&w=majority&appName=Cluster0')
  .then((e) => console.log("MongoDB Connected"));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {});

// Set up session management with MongoDB store
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/productDB',
    // Additional options if needed
  })
}));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Set up routes
var index = require('./routes/index');
app.use('/', index);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:' + PORT);
});
