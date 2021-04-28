const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  age: {
    type: Number,
    index: true,
    required: true,
  },
  gender: {
    type: String,
    enum: ['both', 'male', 'female'],
    index: true,
    required: true,
  },
  reach: {
    type: Number,
    required: true,
  },
  click: {
    type: Number,
    required: true,
  },
  usedBudget: {
    type: Number,
    default: 0,
  },
});

const userStatsSchema = new mongoose.Schema({
  country: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  stats: [statsSchema],
});

statsSchema.virtual('cpr').get(function() {
  return this.usedBudget / this.reach ;
});

statsSchema.virtual('cpc').get(function() {
  return this.usedBudget / this.click ;
});

module.exports = mongoose.model('UserStats', userStatsSchema);
