const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const db = require('./db/db_config');
require('dotenv').config(); // This allows us to use variables in .env file through process.env
const isProduction = process.env.NODE_ENV === 'production'; // process.env will be used by heroku to provide configs and NODE_ENV will be set to production there.
const history = require('connect-history-api-fallback');

// import all the express routes we will be using
const shortsRouter = require('./routes/shorts');
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index')

// create our app
const app = express();

// set up user session
app.use(session({
  secret: 'URL-shortener',
  resave: true,
  saveUninitialized: true
}));

// allows us to make requests from POSTMAN
app.use(cors());

// set up the app to use dev logger
app.use(logger('dev'));

// accept json
app.use(express.json());

// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
// allows object nesting in POST
app.use(express.urlencoded({ extended: false }));

// cookies for sessions
app.use(cookieParser());

app.use(history());
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'public')));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// connect url hierarchies to our routers
app.use('/', indexRouter);
app.use('/api/shorts', shortsRouter);
app.use('/api/session', usersRouter);

app.all('*', (req, res) => {
  const errorMessage = `
    Cannot find the resource <b>${req.url}</b>
    <br>
    Please use only supported routes below
    <br><br>

    <b>Home Page and URL Shortening</b>
    <br>
    GET / -- Go to home page
    <br>
    GET /:name -- Go to URL of short named :name

    <br><br>

    <b>Shorts</b>
    <br>
    GET /api/shorts -- Display all shorts stored on the server
    <br>
    POST /api/shorts -- Create and store a new short on the server
    <br>
    PUT /api/shorts/:name -- Update the short on the server with short name :name
    <br>
    DELETE /api/shorts/:name -- Delete the short on the server with short name :name

    <br><br>

    <b>Authentication</b>
    <br>
    POST /api/session -- Authenticate with username into the server
  `;

  res.status(404).send(errorMessage);
});

console.log("Running on localhost:3000...");

module.exports = app;
