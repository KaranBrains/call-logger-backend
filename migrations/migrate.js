const User = require("../models/User");

exports.createAdmin= ()=> {
    const incomingUser = {
        email : "admin@callLogger.com",
        fullName : "Admin",
        phone : "123456789" ,
        password : "Admin123@",
        role: 'admin',
    }
    
    let newUser = User(incomingUser);
    newUser.save((err, user) => {
    if (err) {
        console.log(err);
    }
    console.log(user);
    });
} 
