// const Review = require("./../model/reviewModel");
// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
// const factory=require('./handlFactory');


// exports.getAllReviews=factory.getAll(Review);
// // exports.getAllReviews=catchAsync(async(req,res,next)=>{
// //     let filter={};
// //     if(req.params.tourId){
// //         filter={tour:req.params.tourId};
// //         console.log(filter)
// //     }
// //     const reviews=await Review.find(filter);
// //     res.status(200).json({
// //         status:'sucess',
// //         result:reviews.length,
// //         data:{
// //             reviews
// //         }
// //     })
// // });

// exports.getReview=factory.getOne(Review);

// // exports.setTourUserIds=(req,res,next)=>{
// //     if(!req.body.tour) req.body.tour=req.params.tourId;
// //     if(!req.body.user) req.body.user=req.user.id;
// //     next();
// // }

// // exports.createReview= factory.createOne(Review)

// exports.createReview=catchAsync(async(req,res,next)=>{
//     //Nested routes
//     if(!req.body.tour) req.body.tour=req.params.tourId;
//     if(!req.body.user) req.body.user=req.user.id;
//     const newReview=await Review.create(req.body);
//     res.status(201).json({
//         status:'sucess',
//         data:{
//             review:newReview
//         }
//     })
// })

// exports.updateReview=factory.updateOne(Review);
// exports.deleteReview=factory.deleteOne(Review);


const Review = require('./../model/reviewModel');
const factory = require('./handlFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
