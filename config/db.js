const mongoose = require('mongoose');
const config = require('config');
const db = config.get('dbURI');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Employee', {
      useNewUrlParser: true
    });
    console.log('Mongo Db is connected');
  } catch (error) {
    console.log(db);
    console.log('Messager error');
    console.log(error.message);
    //   Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
