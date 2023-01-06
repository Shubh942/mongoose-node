const User = require("./../model/usermodel");
const multer=require('multer');
const sharp=require('sharp');
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory=require('./handlFactory');


// const multerStorage=multer.diskStorage({
//   //cd=>next
//   destination:(req,file,cb)=>{
//     cb(null,'public/img/users');
//   },
//   filename:(req,file,cb)=>{
//     const ext=file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }
  else{
    cb(new AppError('Not an image! Please upload only images.',400),false);

  }
}



const upload=multer({
  
  storage:multerStorage,
  fileFilter:multerFilter

});

exports.uploadUserPhoto=upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers=factory.getAll(User);
// exports.getAllUsers =catchAsync( async(req, res,next) => {

//     const user = await User.find();

//     // SEND RESPONSE
//     res.status(200).json({
//       status: "success",
//       results: user.length,
//       data: {
//         user,
//       },
//     });
//   // res.status(500).json({
//   //   status: "error",
//   //   message: "This route is not yet defined!",
//   // });
// });

// exports.updateMe=catchAsync(async(req,res,next)=>{
//   console.log(req.body)
//   if (!req.body.password || !req.body.passwordConfirm) {
//     return next(new AppError('This route is not defined for updating password Please use /updateMyPassword',400))

//   }
//   const user=await User.findById(req.user.id) 
// })
exports.getMe=(req,res,next)=>{
  req.params.id=req.user.id;
  next();
}


exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if(req.file)filteredBody.photo=req.file.filename;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getUser=factory.getOne(User);

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);

//   next();
// });
// exports.getUser =catchAsync(async(req, res) => {

//   const user = await User.findById(req.params.id);
//     // Tour.findOne({ _id: req.params.id })
//     if (!user) {
//       return next(new AppError('No user found with that ID', 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         user,
//       },
//     });

//   // res.status(500).json({
//   //   status: "error",
//   //   message: "This route is not yet defined!",
//   // });
// });

exports.deleteMe=catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false});

  res.status(204).json({
    status:"sucess"
  })
})


exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
//Do not update password with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);