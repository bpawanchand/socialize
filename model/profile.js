const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date,
        required: false
      },
      current: {
        type: Boolean,
        default: false
      },
      desc: {
        type: String
      }
    }
  ],

  education: [
    {
      school: {
        type: String
      },
      degree: {
        type: String
      },
      fieldofstudy: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: String
      },
      current: {
        type: Boolean,
        default: false
      },
      desc: {
        type: String
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
