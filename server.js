const express = require('express');
const db = require('../socialize/config/db');

// const db = require('./config/dbConnect');
const app = express();

db();

app.get('/', (req, res) => {
  res.send('Api is Running...');
});
//  Initialize middle ware of the express. This allows to parse the request body .
app.use(express.json({ extended: false }));
// Routes
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/post', require('./routes/post'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
