const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
});

module.exports = mongoose.model('Campaign', campaignSchema);
