const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

// middleware function: signin authentication of username and password
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ hi: 'there' });
  });
  // requireSignin acts as a middleware to the Authentication.signin
  // Authentication.signin will give user a token
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
