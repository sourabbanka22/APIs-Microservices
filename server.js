const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const mongoose = require('mongoose')

require('dotenv').config({path: __dirname + '/.env'})

const {dateNow, formattedDate} = require('./timeStamp/scripts');
const { whoAmI } = require('./headerParser/scripts');
const { isDomainValid, isUrlValid, createNew, checkNew } = require('./urlShortner/scripts');
const { fileUpload } = require('./fileMetadata/scripts');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({optionsSuccessStatus: 200}));


app.use( express.static( path.join(__dirname + '/public') ) );
app.get('/', function(req, res){
  res.sendFile( path.join(__dirname + '/index.html') );
});

// TimeStamp Microservice
app.get("/api/timestamp/", (req, res) => dateNow(req, res));
app.get("/api/timestamp/:date_string", (req, res, next) => formattedDate(req, res, next));

// Header Parser
app.get('/api/whoami', (req, res) => whoAmI(req, res));

// URL Shortner
app.use('/api/shorturl/new', isDomainValid);
app.post('/api/shorturl/new', isUrlValid, (req, res) => createNew(req, res))
app.get('/api/shorturl/:i', (req, res) => checkNew(req, res))

// File Metadata
app.post('/api/filedetails', upload.single('uploadFile'), (req, res) => fileUpload(req, res));

// Exercise Tracker
const apiRouter = require('./exerciseTracker/scripts');
app.use('/api/exercise', apiRouter);

app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})
app.use((err, req, res, next) => {
  let errCode, errMessage
  if (err.errors) {
    errCode = 400
    const keys = Object.keys(err.errors)
    errMessage = err.errors[keys[0]].message
  } else {
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})




app.listen(process.env.PORT, () => console.log("Server is Working"));