const customErr = require("../utilities/customError");

function devErrors(res, error) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
}

function prodErrors(res, error) {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again!",
    });
  }
}

function castErrorHandler(error) {
  const msg = `Invalid value for the feild ${error.path} : ${error.value}`;
  return new customErr(msg, 400);
}

function handleDuplicateKeyError(error) {
  const msg = `The email : ${error.keyValue.email} already exists!`;
  return new customErr(msg, 400);
}

function handleJwtError(error) {
  const msg = ` ${error.message}, The JWT Token has been hampered, Login again!`;
  return new customErr(msg, 400);
}
function handleEmptyBodyError(error) {
  const msg = `Empty Text cannot be posted!, please add some content`;
  return new customErr(msg, 400);
}
function handleValidationError(error) {
  const msg = `Cast to ObjectId failed for value ${error.errors.postId.value}`;
  return new customErr(msg, 400);
}

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === "JsonWebTokenError") error = handleJwtError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.type === "entity.parse.failed")
      error = handleEmptyBodyError(error);

    prodErrors(res, error);
  }
};
