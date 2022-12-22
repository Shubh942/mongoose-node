const {promisify}=require('util')
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

exports.protect=catchAsync( async(req,res,next)=>{
  let token;
  //Checking if it contain token or not
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token=req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in! Please login first',401));

  }
  //Verification
  // console.log(token)
  // const decoded=await promisify(jwt.verify)(token,'mysecretkey')
  const decoded = jwt.verify(token, 'mysecretkey');
  console.log(decoded)
  //User is still a active user
  const freshUser=await User.findById(decoded.id);
  if(!freshUser){
    return next(new AppError('User belonging to this token does no longer exists',401));

  }
  
//Grant access to the user
req.user=freshUser;


  next();
});

exports.restrictTo=(...roles)=>{
  return(req,res,next)=>{
    console.log(req.user.role)
    if(!roles.includes(req.user.role)){
      return next(new AppError('You do not permission to perform this action',403));

    }
    next();
  }
}
