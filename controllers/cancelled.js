const Cancelled = require("../models/Cancelled");

exports.addCancelled = async (req, res) => {
  if (
    !req.body.id ||
    !req.body.phoneNo ||
    !req.body.time 
  ) {
    return res.status(400).json({ msg: 'Invalid data' });
  }
  Cancelled.findOne({userId:req.body.id})
  .then(userEntry=>{
    if ( userEntry ) {
        const cancelledCall = {
            phoneNo: req.body.phoneNo,
            time: req.body.time
        }
        userEntry.calls.push(cancelledCall);
        userEntry.save()
        .then(call=>{
          return res.status(200).json({ cancelled: call}); 
        })
        .catch(err=>{
          return res.status(400).json({ msg: err.message });
        })
    } else {
        let newEntry = new Cancelled({
            userId: req.body.id,
            calls: [
                {
                    phoneNo: req.body.phoneNo,
                    time: req.body.time 
                }
            ]
        });
        newEntry.save()
        .then(call=>{
            return res.status(200).json({ cancelled: call}); 
        })
        .catch(err=>{
            return res.status(400).json({ msg: err.message });
        })
    }
  })
  .catch(err=>{
    return res.status(400).json({ msg: err.message });
  })
};

exports.getCancelledByUserId = (req, res) => {
    if (
      !req.query.id
    ) {
      return res.status(400).json({ msg: 'Please Send Id' });
    }
    Cancelled.findOne({userId:req.query.id})
    .then(cancelled=>{
        return res.status(200).json({ cancelledById : cancelled }); 
    })
};


