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
  expires_at: {
    type: Date,
  },
  daily_budget: {
    type: Number,
    required: true,
  },
  remaining_budget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['opened', 'closed', 'pending'],
    default: 'pending',
  },
  payment_method: {
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
  this.remaining_budget = this.get('daily_budget');
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);
