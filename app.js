const express = require('express');
const db = require('../socialize/config/db');
// const db = require('./config/dbConnect');
const app = express();
db();

app.get('/', (req, res) => {
  res.send('Api is Running...');
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
