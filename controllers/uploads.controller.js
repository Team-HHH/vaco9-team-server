const createError = require('http-errors');

exports.uploadImage = async function (req, res, next) {
  try {
    const imageUrl = req.file.location;

    res.json({
      code: 200,
      message: 'upload image success',
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    next(createError(500, error));
  }
};
