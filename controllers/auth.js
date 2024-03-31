const User = require("../models/userModel");
const { signToken, verifyToken } = require("../utilities/jwt");
const customErr = require("../utilities/customError");
const asyncErrHandler = require("../utilities/asyncError");

exports.signUpUser = asyncErrHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const userPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };
  const token = signToken(userPayload);
  const cookieOptions = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,
  };

  res.cookie("authToken", token, cookieOptions).json({
    status: "success",
    user,
  });
});

exports.loginUser = asyncErrHandler(async (req, res, next) => {
  let user;

  user = await User.findOne({ email: req.body.email }).select("+password");
  const isPswdMatch = await user.compareDBpswd(
    req.body.password,
    user.password
  );

  if (!user || !isPswdMatch) {
    const err = new customErr("Incorrect Email or Password", 400);
    return next(err);
  }

  const userPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };
  const token = signToken(userPayload);

  user.password = undefined;

  const cookieOptions = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,
  };

  res.cookie("authToken", token, cookieOptions).json({
    status: "success",
    message: "login successful",
    user,
  });
});

exports.authorizeUser = asyncErrHandler(async (req, res, next) => {
  if (!req.cookies["authToken"]) {
    const err = new customErr(
      "You are not logged in, please login again!",
      400
    );
    return next(err);
  }

  let token = req.cookies["authToken"];

  const decodedToken = await verifyToken(token);

  const user = await User.findById(decodedToken._id);

  if (!user) {
    const err = new customErr("user with the given token does not exist", 400);
    return next(err);
  }

  req.user = user;

  next();
});

exports.restrictRoutes = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      const err = new customErr(
        "you dont have permission to access this resource",
        403
      );
      return next(err);
    }
    next();
  };
};
