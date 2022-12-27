// const {promisify}=require('util')
const catchAsync = require("./../utils/catchAsync");
const User = require("./../model/usermodel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, "mysecretkey", {
    expiresIn: "90d",
  });
};


const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};



exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo:req.body.photo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword});
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    //so that after the response no other response will send to client
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  // console.log(user);
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  const correct = await user.correctPassword(password, user.password);
  // console.log("kkk");
  if (!correct) {
    return next(new AppError("Invalid email or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Checking if it contain token or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in! Please login first", 401));
  }
  //Verification
  // console.log(token)
  // const decoded=await promisify(jwt.verify)(token,'mysecretkey')
  const decoded = jwt.verify(token, "mysecretkey");
  console.log(decoded);
  //User is still a active user
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User belonging to this token does no longer exists", 401)
    );
  }

  //Grant access to the user
  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  console.log("i'm")
  await user.save({ validateBeforeSave: false });
  console.log('yes')

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
    
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!'),500);
  }

  console.log("done")
});

exports.resetPassword = (req, res, next) => {};


exports.updatePassword=catchAsync(async(req,res,next)=>{

  const user=await User.findOne(req.res.id).select('+password');
  if (! await user.correctPassword(req.body.passwordCurrent,user.password)) {
    return next(new AppError('Your current password is wrong',401));

  }
  user.password=req.body.password;
  user.confirmPassword=req.body.confirmPassword;
  await user.save();

  createSendToken(user, 200, res);
})