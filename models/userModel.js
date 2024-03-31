const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is a required feild"],
    },
    email: {
      type: String,
      required: [true, "email is a required feild"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is arequired feild"],
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 8);

  next();
});

userSchema.methods.compareDBpswd = async (pswd, DBpswd) => {
  return await bcrypt.compare(pswd, DBpswd);
};

const User = model("user", userSchema);

module.exports = User;
