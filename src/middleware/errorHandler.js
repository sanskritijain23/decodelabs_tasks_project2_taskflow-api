function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const error = { message };

  if (err.details) {
    error.details = err.details;
  }

  res.status(status).json({
    success: false,
    error,
  });
}

module.exports = errorHandler;
