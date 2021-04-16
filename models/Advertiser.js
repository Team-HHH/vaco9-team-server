const mongoose = require('mongoose');

const advertiserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  companyName: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  companyEmail: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  companyRegistrationNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
  }],
});

module.exports = mongoose.model('Advertiser', advertiserSchema);
