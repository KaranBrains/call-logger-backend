const Missed = require("../models/Missed");

exports.addMissed = async (req, res) => {
  if (
    !req.body.id ||
    !req.body.phoneNo ||
    !req.body.time 
  ) {
    return res.status(400).json({ msg: 'Invalid data' });
  }
  Missed.findOne({userId:req.body.id})
  .then(userEntry=>{
    if ( userEntry ) {
        const MissedCall = {
            phoneNo: req.body.phoneNo,
            time: req.body.time
        }
        userEntry.calls.push(MissedCall);
        userEntry.save()
        .then(call=>{
          return res.status(200).json({ Missed: call}); 
        })
        .catch(err=>{
          return res.status(400).json({ msg: err.message });
        })
    } else {
        let newEntry = new Missed({
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
            return res.status(200).json({ Missed: call}); 
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

exports.getMissedByUserId = (req, res) => {
    if (
      !req.query.id
    ) {
      return res.status(400).json({ msg: 'Please Send Id' });
    }
    Missed.findOne({userId:req.query.id})
    .then(Missed=>{
        return res.status(200).json({ MissedById : Missed }); 
    })
};


