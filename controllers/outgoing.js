const Outgoing = require("../models/Outgoing");
const multer = require('multer');
const mongodb = require('mongodb');
const config      = require('../config/config');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { Readable } = require('stream');
let db;
// MongoClient.connect(config.db, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true },(err, client) => {
//   if (err) {
//     console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
//     process.exit(1);
//   }
//   console.log("Mongoose Connected")
//   db = client.db('test');
// });

// exports.addOutgoing = async (req, res) => {
//   const storage = multer.memoryStorage()
//   const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
//   upload.single('track')(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ message: "Upload Request Validation Failed" });
//     }
//     if (
//       !req.fields.id ||
//       !req.fields.phoneNo ||
//       !req.fields.time ||
//       !req.fields.duration
//     ) {
//       return res.status(400).json({ msg: 'Invalid data' });
//     }
//     let trackName = req.fields.phoneNo + req.fields.time;
    
//     // Covert buffer to Readable Stream
//     const readableTrackStream = new Readable();
//     readableTrackStream.push(req.files.track.buffer);
//     readableTrackStream.push(null);

//     let bucket = new mongodb.GridFSBucket(db, {
//       bucketName: 'tracks'
//     });

//     let uploadStream = bucket.openUploadStream(trackName);
//     let id = uploadStream.id;
//     readableTrackStream.pipe(uploadStream);

//     uploadStream.on('error', () => {
//       return res.status(500).json({ message: "Error uploading file" });
//     });

//     uploadStream.on('finish', () => {
//       Outgoing.findOne({userId:req.fields.id})
//       .then(userEntry=>{
//         if ( userEntry ) {
//             const OutgoingCall = {
//                 phoneNo: req.fields.phoneNo,
//                 time: req.fields.time,
//                 duration: req.fields.duration,
//                 recording: id
//             }
//             userEntry.calls.push(OutgoingCall);
//             userEntry.save()
//             .then(call=>{
//               return res.status(200).json({ Outgoing: call}); 
//             })
//             .catch(err=>{
//               return res.status(400).json({ msg: err.message });
//             })
//         } else {
//             let newEntry = new Outgoing({
//                 userId: req.fields.id,
//                 calls: [
//                     {
//                         phoneNo: req.fields.phoneNo,
//                         time: req.fields.time,
//                         duration: req.fields.duration,
//                         recording: id
//                     }
//                 ]
//             });
//             newEntry.save()
//             .then(call=>{
//                 return res.status(200).json({ Outgoing: call}); 
//             })
//             .catch(err=>{
//                 return res.status(400).json({ msg: err.message });
//             })
//         }
//       })
//       .catch(err=>{
//         return res.status(400).json({ msg: err.message });
//       })
//     });
//   });
// };

exports.getOutgoingByUserId = (req, res) => {
    if (
      !req.query.id
    ) {
      return res.status(400).json({ msg: 'Please Send Id' });
    }
    Outgoing.findOne({userId:req.query.id})
    .then(Outgoing=>{
        return res.status(200).json({ OutgoingById : Outgoing }); 
    })
};

// exports.getOutgoingRecordingById = (req, res) => {
//   if (
//     !req.query.id
//   ) {
//     return res.status(400).json({ msg: 'Please Send Id' });
//   }
//   try {
//     var trackID = new ObjectID(req.query.id);
//   } catch(err) {
//     return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
//   }
//   res.set('content-type', 'audio/mp3');
//   res.set('accept-ranges', 'bytes');

//   let bucket = new mongodb.GridFSBucket(db, {
//     bucketName: 'tracks'
//   });

//   let downloadStream = bucket.openDownloadStream(trackID);

//   downloadStream.on('data', (chunk) => {
//     res.write(chunk);
//   });

//   downloadStream.on('error', () => {
//     res.sendStatus(404);
//   });

//   downloadStream.on('end', () => {
//     res.end();
//   });
// };


