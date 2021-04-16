const mongoose = require('mongoose');

const bodyPartSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  videos: [{
    url: {
      type: String,
      trim: true,
    },
  }],
});

module.exports = mongoose.model('BodyPart', bodyPartSchema);
