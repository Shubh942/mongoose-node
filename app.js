const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController");
const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, Please try again in an hour",
});

app.use(helmet());
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
//prevent nosql injection
app.use(mongoSanitize());
//prevent client side xss
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  const er = new AppError(`Can't find ${req.originalUrl} on server`, 404);
  // res.status(404).json({
  //     status:'fail',
  //     message:`Can't find ${req.originalUrl} on server`
  // })
  next(er);
});

app.use(globalErrorController);
// const testTour=new Tour({
//     name:'The forest hiker',
//     rating:4.7,
//     price:497
// })

// testTour.save().then(doc=>{
//     console.log(doc)
// }).catch(err=>{
//     console.log(err)
// })

module.exports = app;
