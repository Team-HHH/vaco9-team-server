const createError = require('http-errors');
const Video = require('../models/Video');

exports.video = async function (req, res, next) {
  try {
    const videos = await Video.find();

    res.json({
      code: 200,
      message: 'success',
      data: {
        videos,
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};
