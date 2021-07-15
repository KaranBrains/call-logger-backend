const express     = require("express");
const mongoose    = require('mongoose');
const config      = require('./config/config');
const cors        = require('cors');
const route       = require('./routes/router.js');
const createAdmin = require('./migrations/migrate');
const path        = require('path');
const trackRoute = express.Router();
const outgoingRoute = express.Router();
const Received = require("./models/Received");
const Outgoing = require("./models/Outgoing");
const multer = require('multer');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

/**
 * NodeJS Module dependencies.
 */
const { Readable } = require('stream');

const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('../../../../../etc/letsencrypt/live/pigameapp.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('../../../../../etc/letsencrypt/live/pigameapp.com/cert.pem', 'utf8');
const ca = fs.readFileSync('../../../../../etc/letsencrypt/live/pigameapp.com/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const app = express();
const httpsServer = https.createServer(credentials, app);
app.use('/received', trackRoute);
app.use('/outgoing', outgoingRoute);

/**
 * Connect Mongo Driver to MongoDB.
 */
let db;
MongoClient.connect(config.db, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true }, (err, database) => {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  }
  db = database.db('test');
});

mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true })
.then(()=>{
    console.log("Mongo DB connected")
})

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use('/', route.init());
app.use('/images', express.static(path.join('assets/images/barberknocks')));

trackRoute.get('/:trackID', (req, res) => {
    try {
        var trackID = new ObjectID(req.params.trackID);
    } catch(err) {
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'tracks'
    });

    let downloadStream = bucket.openDownloadStream(trackID);

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);
    });

    downloadStream.on('end', () => {
        res.end();
    });
});

trackRoute.post('/add', (req, res) => {
    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage, limits: { fields: 5, fileSize: 6000000, files: 1, parts: 5 }});
    upload.single('track')(req, res, (err) => {
      if (err) {
          console.log(err);
        return res.status(400).json({ message: "Upload Request Validation Failed" });
      }
      if (
        !req.body.id ||
        !req.body.phoneNo ||
        !req.body.time ||
        !req.body.duration
      ) {
        return res.status(400).json({ msg: 'Invalid data' });
      }
      let trackName = req.body.phoneNo + req.body.time;
      
      // Covert buffer to Readable Stream
      const readableTrackStream = new Readable();
      readableTrackStream.push(req.file.buffer);
      readableTrackStream.push(null);
  
      let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'tracks'
      });
  
      let uploadStream = bucket.openUploadStream(trackName);
      let id = uploadStream.id;
      readableTrackStream.pipe(uploadStream);
  
      uploadStream.on('error', () => {
        return res.status(500).json({ message: "Error uploading file" });
      });
  
      uploadStream.on('finish', () => {
        Received.findOne({userId:req.body.id})
        .then(userEntry=>{
          if ( userEntry ) {
              const ReceivedCall = {
                  phoneNo: req.body.phoneNo,
                  time: req.body.time,
                  duration: req.body.duration,
                  recording: id
              }
              userEntry.calls.push(ReceivedCall);
              userEntry.save()
              .then(call=>{
                return res.status(200).json({ Received: call}); 
              })
              .catch(err=>{
                return res.status(400).json({ msg: err.message });
              })
          } else {
              let newEntry = new Received({
                  userId: req.body.id,
                  calls: [
                      {
                          phoneNo: req.body.phoneNo,
                          time: req.body.time,
                          duration: req.body.duration,
                          recording: id
                      }
                  ]
              });
              newEntry.save()
              .then(call=>{
                  return res.status(200).json({ Received: call}); 
              })
              .catch(err=>{
                  return res.status(400).json({ msg: err.message });
              })
          }
        })
        .catch(err=>{
          return res.status(400).json({ msg: err.message });
        })
      });
    });
});

outgoingRoute.get('/:trackID', (req, res) => {
    try {
        var trackID = new ObjectID(req.params.trackID);
    } catch(err) {
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'tracks'
    });

    let downloadStream = bucket.openDownloadStream(trackID);

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);
    });

    downloadStream.on('end', () => {
        res.end();
    });
});

outgoingRoute.post('/add', (req, res) => {
    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage, limits: { fields: 5, fileSize: 6000000, files: 1, parts: 5 }});
    upload.single('track')(req, res, (err) => {
      if (err) {
          console.log(err);
        return res.status(400).json({ message: "Upload Request Validation Failed" });
      }
      if (
        !req.body.id ||
        !req.body.phoneNo ||
        !req.body.time ||
        !req.body.duration
      ) {
        return res.status(400).json({ msg: 'Invalid data' });
      }
      let trackName = req.body.phoneNo + req.body.time;
      
      // Covert buffer to Readable Stream
      const readableTrackStream = new Readable();
      readableTrackStream.push(req.file.buffer);
      readableTrackStream.push(null);
  
      let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'tracks'
      });
  
      let uploadStream = bucket.openUploadStream(trackName);
      let id = uploadStream.id;
      readableTrackStream.pipe(uploadStream);
  
      uploadStream.on('error', () => {
        return res.status(500).json({ message: "Error uploading file" });
      });
  
      uploadStream.on('finish', () => {
        Outgoing.findOne({userId:req.body.id})
        .then(userEntry=>{
          if ( userEntry ) {
              const OutgoingCall = {
                  phoneNo: req.body.phoneNo,
                  time: req.body.time,
                  duration: req.body.duration,
                  recording: id
              }
              userEntry.calls.push(OutgoingCall);
              userEntry.save()
              .then(call=>{
                return res.status(200).json({ Outgoing: call}); 
              })
              .catch(err=>{
                return res.status(400).json({ msg: err.message });
              })
          } else {
              let newEntry = new Outgoing({
                  userId: req.body.id,
                  calls: [
                      {
                          phoneNo: req.body.phoneNo,
                          time: req.body.time,
                          duration: req.body.duration,
                          recording: id
                      }
                  ]
              });
              newEntry.save()
              .then(call=>{
                  return res.status(200).json({ Outgoing: call}); 
              })
              .catch(err=>{
                  return res.status(400).json({ msg: err.message });
              })
          }
        })
        .catch(err=>{
          return res.status(400).json({ msg: err.message });
        })
      });
    });
});



app.listen(8082,()=>{

    console.log("Server is running on port : 8082");
    // run this to create a admin only once on the first run
    // createAdmin.createAdmin();
})

httpsServer.listen(8081, () => {
    console.log("Server is running on port : 1234");
});