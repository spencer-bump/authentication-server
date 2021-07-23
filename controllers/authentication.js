const bcrypt      = require('bcryptjs');
const jwt         = require('jwt-simple');
const { secret }  = require('../env');

const User    = require('../models/user');

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, secret);
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({ error: "You must provide email and password" });
  }

  User.findOne({ email: email }, (error, existingUser) => {
    // database error
    if (error) { return next(error); }
    // See if email exists, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
    // If email does not exist, create and save record
    const user = new User({
      email: email,
      password: password
    });

    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) { return next(saltError); }
      console.log("salt: ", salt)
      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) { return next(hashError); }

        console.log("hash: ", hash)
        user.password = hash;
        user.save((error) => {
          if (error) { return next(error); }
          // Respond to request with token
          res.json({ token: tokenForUser(user) });
        });
      });
    });
    // inside User.findOne
  });
  // inside signup
}
