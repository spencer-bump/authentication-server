const passport       = require('passport');
const User           = require('../models/user');
const { secret }     = require('../env');
const JwtStrategy    = require('passport-jwt').Strategy;
const ExtractJwt     = require('passport-jwt').ExtractJwt;
const LocalStrategy  = require('passport-local');
const bcrypt         = require('bcryptjs');

// ***********************
// Local Strategy to Verify Email and Password
// 1) Create Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Compare stored bcrypt password with incoming password
  const comparePassword = (candidatePassword, callback) => {
    console.log("bcrypt.compare: w", password)
    bcrypt.compare(candidatePassword, password, (error, isMatch) => {
      if (error) { return callback(error); }
      callback(null, isMatch);
    });
  }

  // Verify thus username and password, call done with user
  // if it is correct username and password,
  // otherwise call done with false
  User.findOne({ "email": email }, (findError, user) => {
    if (findError) { return done(findError); }
    if (!user) { return done(null, false); }

    // used bcrypt to salt and hash our initial password before
    // saving to the database as user.password
    // Need to encrypt the incoming password and compare it with
    // our stored password.
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) { return done(error); }
      if (!isMatch) { return done(null, false); }
      return done(null, user);
    });
  });
});

// **************************
// JWT Strategy to Verify Tokens
// 1) Setup options for JWT Strategy - verify tokens
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret
};
// 2) Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // payload is the jwt token: sub and timestamp
// See if the user ID in the payload exists in our database
// If it does, call 'done' with that user
// otherwise, call done without user object
  User.findById(payload.sub, (error, user) => {
    if (error) { return done(error, false); }
    user ? done(null, user) : done(null, false);
  });
});

//***************
// Passport to use Strategies
passport.use(jwtLogin);
passport.use(localLogin);

