const passport = require('passport');
const User = require('../models/user');
const { secret } = require('../env');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// 1) Setup options for JWT Strategy
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

// 3) Tell passport tu use this Strategy
passport.use(jwtLogin);

