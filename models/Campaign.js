const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advertiser',
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    trim: true,
    enum: ['banner', 'text', 'video'],
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
  expiresAt: {
    type: Date,
  },
  dailyBudget: {
    type: Number,
    required: true,
  },
  remainingBudget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['opened', 'closed', 'pending'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'trans', 'phone'],
  },
  stats: [{
    date: {
      type: Date,
      index: true,
    },
    reach: {
      type: Number,
      default: 0,
    },
    click: {
      type: Number,
      default: 0,
    },
    usedBudget: {
      type: Number,
      default: 0,
    },
  }],
});

campaignSchema.pre('save', function (next) {
  this.remainingBudget = this.get('dailyBudget');
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);
