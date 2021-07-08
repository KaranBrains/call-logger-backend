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
});

const CancelledSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true
    },
    calls: [CallSchema]
});

module.exports = mongoose.model('Cancelled', CancelledSchema);
