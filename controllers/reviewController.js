const Review = require("./../model/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllReviews=catchAsync(async(req,res,next)=>{
    const reviews=await Review.find();
    res.status(200).json({
        atatus:'sucess',
        data:{
            reviews
        }
    })
});

exports.createReview=catchAsync(async(req,res,next)=>{
    //Nested routes
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user.id;
    const newReview=await Review.create(req.body);
    res.status(201).json({
        status:'sucess',
        data:{
            review:newReview
        }
    })
})