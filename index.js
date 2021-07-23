const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const morgan = require('morgan');


const router = require('./router');
const { DB_URL } = require('./env');
const User = require('./models/user');

const app = express();

// App setup
app.use(cors());
// morgan adds logging to console
// mostly for debugging
app.use(morgan('combined'));
// bodyParser - parses incoming requests
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// actions
app.get('/users', (req, res) => {
  console.log('users requested')
  User.find({}, (error, users) => {
    res.send(users[0]);
  });
});
// port/dbname', { useNewUrlParser: true })

// DATABASE CONNECTION
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, error => {
  if (error) console.error(error)
  console.log('mongodb connection successful');
})

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port: ', port);

