const Tour = require("./../model/tourmodel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");

// exports.getOverview=async (req,res)=>{
//     tour=await Tour.find();
//     res.status(200).render('overview',{
//         // title:'Exciting tours for adventurous people',
//         tour
//     })
// }

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

  res.status(statusCode).redirect('/');
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  // console.log(tour.reviews[0].user)
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.getLoggedIn=catchAsync(async(req,res,next)=>{
  const { email, password } = req.body;
  if (!email || !password) {


    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  // console.log(user);

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  const correct = await user.correctPassword(password, user.password);

  if (!correct) {
    return next(new AppError("Invalid email or password", 401));
  }
  createSendToken(user, 200, res);
})

exports.getAccount = async(req, res) => {
  // console.log(req.user)
  const user=await User.findById(req.user.id)
  console.log(user.role)
  res.status(200).render('account', {
    title: 'Your account',
    user
  });
};


exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
    
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
