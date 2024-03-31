const User = require("../models/userModel");
const asyncErrHandler = require("../utilities/asyncError");
const customErr = require("../utilities/customError");

exports.getAllUsers = asyncErrHandler(async (req, res, next) => {
  const users = await User.find({});

  res.json({
    status: "success",
    data: [...users],
  });
});

exports.getUser = asyncErrHandler(async (req, res, next) => {
  const _id = req.params.userId;
  const user = await User.findById(_id);
  if (!user) {
    const err = new customErr("Invalid user Id", 400);
    return next(err);
  }

  res.json({
    status: "success",
    user,
  });
});
