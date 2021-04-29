const mongoose = require('mongoose');
const { endOfDay, startOfDay } = require('date-fns');

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
  campaignUrl: {
    type: String,
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
  country: {
    type: String,
    trim: true,
    required: true,
  },
  minAge: {
    type: Number,
    required: true,
  },
  maxAge: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
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
  reachExposed: [{
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    country: {
      type: String,
      trim: true,
      required: true,
    },
  }],
  clickExposed: [{
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    country: {
      type: String,
      trim: true,
      required: true,
    },
  }],
});

campaignSchema.statics.addStatsIfDoesNotExist = async function (id, date) {
  const isTodayStatsExist = await this.exists({
    _id: id,
    'stats.date': {
      $gte: startOfDay(date),
      $lte: endOfDay(date)
    }
  });

  if (!isTodayStatsExist) {
    return this.findByIdAndUpdate(
      id,
      { $addToSet: { stats: { date: date } } }
    );
  }
};

campaignSchema.statics.addReachCount = async function (id, user) {
  const today = new Date();

  await this.addStatsIfDoesNotExist(id, today);

  return this.findOneAndUpdate(
    {
      _id: id,
      'stats.date': {
        $gte: startOfDay(today),
        $lte: endOfDay(today)
      }
    },
    {
      $inc: { 'stats.$.reach': 1 },
      $push: {
        age: user.age,
        gender: user.gender,
        country: user.country,
      }
    }
  );
};

campaignSchema.statics.addClickCount = async function (id, user) {
  const today = new Date();

  await this.addStatsIfDoesNotExist(id, today);

  return this.findOneAndUpdate(
    {
      _id: id,
      'stats.date': {
        $gte: startOfDay(today),
        $lte: endOfDay(today)
      }
    },
    {
      $inc: { 'stats.$.click': 1 },
      $push: {
        age: user.age,
        gender: user.gender,
        country: user.country,
      }
    }
  );
};

module.exports = mongoose.model('Campaign', campaignSchema);
