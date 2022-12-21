const User = require("./../model/usermodel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers =catchAsync( async(req, res,next) => {

    const user = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: user.length,
      data: {
        user,
      },
    });
  // res.status(500).json({
  //   status: "error",
  //   message: "This route is not yet defined!",
  // });
});

exports.getUser =catchAsync(async(req, res) => {

  const user = await User.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });

  // res.status(500).json({
  //   status: "error",
  //   message: "This route is not yet defined!",
  // });
});


exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
