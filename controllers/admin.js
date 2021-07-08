const User = require("../models/User");

exports.getUsers = (req, res) => {
    try {
        User.find({ role: 'user' }, (err, users) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }

            if (users) {
                return res.status(200).json({ users: users });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
};
