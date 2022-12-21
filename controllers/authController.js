const catchAsync = require("./../utils/catchAsync");
const User = require("./../model/usermodel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const signToken=(id)=>{
  return jwt.sign({id},'mysecretkey',{
    expiresIn:"90d",
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = jwt.sign({ id: newUser._id }, "mysecretkey", {
    expiresIn: "90d",
  });
  // console.log(newUser)
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
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
  const correct=await user.correctPassword(password,user.password)
  // console.log("kkk");
  if ( !correct) {
    return next(new AppError("Invalid email or password", 401));
  }
  const token=signToken(user._id);
  res.status(200).json({
    status: "sucess",
    token
  });
});
