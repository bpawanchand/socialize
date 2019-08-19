const mongoose = require('mongoose');
// const Schema  = mongoose.Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// The below one single statemet can be split into two lines as below
//  const User = new mongoose.model('user', UserSchema)
// module.exports = User
//  A Model needs two important parameters 1. name of the model
//  2. name of the Schema
module.exports = User = new mongoose.model('user', UserSchema);
