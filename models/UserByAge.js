const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  country: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    required: true,
  },
  age: {
    type: Number,
    index: true,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
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
  userCount: {
    type: Number,
    default: 0,
  },
  targetedCount: {
    type: Number,
    default: 0,
  },
});

statsSchema.virtual('cpm').get(function() {
  return this.usedBudget / this.reach * 1000 ;
});

statsSchema.virtual('cpc').get(function() {
  return this.usedBudget / this.click ;
});

module.exports = mongoose.model('UserByAge', statsSchema);
