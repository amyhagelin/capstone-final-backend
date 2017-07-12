const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UsersRouter = require('./routes/users');
const EventsRouter = require('./routes/events');

mongoose.Promise = global.Promise;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const authMiddleware = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'verysecretstring', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}

app.use('/users', UsersRouter);
// app.use('/events', EventsRouter);
app.use('/events', authMiddleware, EventsRouter);


const DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://localhost/capstone';
const PORT = process.env.PORT || 8080;

let server;


// mlab user: amyhagelin password: thinkful
// mongo ds135552.mlab.com:35552/thinkfulfinalcapstone -u amyhagelin -p thinkful
// Heroku config vars DATABASE_URL mongodb://amyhagelin:thinkful@ds135552.mlab.com:35552/thinkfulfinalcapstone

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
      console.log(databaseUrl);
    mongoose.connect(databaseUrl, err => {
        console.log('mongoose connected')
      if (err) {
        return reject(err);
      }
    
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
 return new Promise((resolve, reject) => {
   console.log('Closing server');
   server.close(err => {
       if (err) {
           return reject(err);
       }
       resolve();
   });
 });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
