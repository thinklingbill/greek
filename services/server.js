// Greek services server
// Bill Roberts, 5/9/2020
// Serves out database content and posts database changes for the greek dataset

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const dbConfig = require('./config/db.config');

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// TODO - look into the cors module
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// This is hardcoded for now
// set the session user variables
app.locals.userId = 1;

// Define the database connection and assign it to a local variable in the res
app.use(function (req, res, next) {
  // setup the connection
  req.app.locals.connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });

  // connect
  req.app.locals.connection.connect();

  next();
});

var vocabulary = require('./routes/vocabulary.routes');
var vocabularyStat = require('./routes/vocabularyStat.routes');
app.use('/api/vocabulary', vocabulary);
app.use('/api/vocabulary-stat', vocabularyStat);

// Default error handler
app.use(function (err, req, res, next) {
  if (err.sqlMessage) { // sql error type
    res.status(500).send({ type: 'sqlError', error: err })
    return;
  }
  else if (err.message) { // regular error type
    res.status(500).send({ type: 'error', error: err.message })
    return;
  }
  res.status(500).send({ type: 'unknown', error: err })
  return;
});


// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});