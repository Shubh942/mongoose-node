const AppError = require("./../utils/appError");
let terror;
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);
  const message = `Duplicate field value. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // console.log("coming\n")
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  console.log("hehee");
  // console.log(err)
  console.log("hehee2");
  return new AppError("Invalid token! Please login again", 401);
  // console.log(err)
};

const handleJWTExpiredError=(err)=>{
  return new AppError("Your token is Expired! Please login again", 401);
}

const sendError = (err, res) => {
  // Operational, trusted error: send message to client
  // console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // error: terror,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      error: terror,
      message: `Something went very wrong!`,
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.statusCode,err.status);
  terror = err;
console.log(err)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  // console.log("start")
  // console.log(err.name);
  // console.log("end")
  // console.log("jrijrij")
  if (err.name === "CastError") error = handleCastErrorDB(error);
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  if (err.name === 'ValidationError') {
    // if(error.errors.name)
    // console.log("I'm in")
    error = handleValidationErrorDB(error);
  }
  // console.log(err)
  if (err.name === "JsonWebTokenError") {
    error = handleJWTError(error);
  }
  if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError(error);
  }
  // if (err.name==="TypeError") {
  //   error= new AppError("ok", 401);
  // }
  // console.log(error)
  // console.log(err)
  sendError(error, res);
};
































// const AppError = require('./../utils/appError');

// const handleCastErrorDB = err => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = err => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   console.log(value);

//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   return new AppError(message, 400);
// };
// const handleValidationErrorDB = err => {
//   const errors = Object.values(err.errors).map(el => el.message);

//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack
//   });
// };

// const sendErrorProd = (err, res) => {
//   // Operational, trusted error: send message to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message
//     });

//     // Programming or other unknown error: don't leak error details
//   } else {
//     // 1) Log error
//     console.error('ERROR 💥', err);

//     // 2) Send generic message
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong!'
//     });
//   }
// };

// module.exports = (err, req, res, next) => {
//   // console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

// //   if (process.env.NODE_ENV === 'development') {
// //     sendErrorDev(err, res);
// //   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err };
// console.error(error)
//     if (error.name === 'CastError') error = handleCastErrorDB(error);
//     if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//     if (error.name === 'ValidationError')
//       error = handleValidationErrorDB(error);

//     sendErrorProd(error, res);

// };
