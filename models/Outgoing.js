const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
    phoneNo : {
        type: String,
        required: true
    },
    time : {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    recording: {
        type: String,
        required: true
    }
});

const OutgoingSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true
    },
    calls: [CallSchema]
});

module.exports = mongoose.model('Outgoing', OutgoingSchema);
