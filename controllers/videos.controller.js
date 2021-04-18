const Video = require('../models/Video');
const createError = require('http-errors');

exports.video = async function (req, res, next) {
  const { bodyPart } = req.body;

  try {
    const videoList = await Video.findOne(
      { bodyPart },
      { urls: 1 }
    );

    res.json({
      code: 200,
      message: 'success',
      data: {
        videoList,
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
};
