const mongoose = require('mongoose');
const config = require('config');
const db = config.get('dbURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('Mongo Db is connected');
  } catch (error) {
    console.log(error.message);
    //   Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
