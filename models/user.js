const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: { //for future enhancement
    type: String,
  },
  comment: {
    type: String,
  },
  rank: {
    type: Number,
    required: true,
    min: 1, max: 3,
  },
  mp3Url: { //for future enhancement
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  songs: {
    type: [songSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3']
  }
});

function arrayLimit(val) {
  return val.length <= 3;
}



const User = mongoose.model("User", userSchema);

module.exports = User;
