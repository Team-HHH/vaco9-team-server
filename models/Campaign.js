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
  campaignType: {
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
  expiresType: {
    type: String,
    trim: true,
    enum: ['continue', 'expired'],
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
    default: 'card',
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

campaignSchema.statics.addReachCount = function (id) {
  return this.findByIdAndUpdate(
    id,
    { $inc: { 'stats.$.reach': 1 } }
  );
};

campaignSchema.statics.addClickCount = function (id) {
  return this.findByIdAndUpdate(
    id,
    { $inc: { 'stats.$.click': 1 } }
  );
};

campaignSchema.pre('save', function (next) {
  this.remainingBudget = this.get('dailyBudget');
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);
