const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaught expression occured, shutting down the server!");

  process.exit(1);
});
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const globalErrorHandler = require("./controllers/error");
const customErr = require("./utilities/customError");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/twiiter")
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(`mongodb connection failed ${err}`));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/user", userRoute);

app.all("*", (req, res, next) => {
  const err = new customErr("Page you requested does not exist", 404);
  next(err);
});

app.use(globalErrorHandler);

const server = app.listen(8000, () => {
  console.log(`app running on port 8000`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("shutting down the server!");
  server.close(() => {
    process.exit(1);
  });
});
