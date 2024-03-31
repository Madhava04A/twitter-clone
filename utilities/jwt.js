const jwt = require("jsonwebtoken");
const util = require("util");

exports.signToken = ({ _id, role, email }) => {
  const token = jwt.sign({ _id, role, email }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });

  return token;
};

exports.verifyToken = async (token) => {
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  return decodedToken;
};
