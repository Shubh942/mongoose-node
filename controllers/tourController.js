const Tour = require("./../model/tourmodel");
const factory=require('./handlFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require("./../utils/apiFeatures");
const mongoose = require("mongoose");
// const multer=require('multer');
// const sharp=require('sharp');
// const { query } = require('express');
const Review = require("../model/reviewModel");

function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// function filterbyproperty(property) {
//   return function (a) {
//     return a.property

//     return 0;
//   };
// }

exports.getAllTours=factory.getAll(Tour)

// exports.getAllTours =catchAsync(async (req, res,next) => {
  
//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     // console.log(features.query)
//     const tours = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//       status: "success",
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "fail",
  //     message: err,
  //   });
  // }
// });

// exports.getAllTours = async (req, res) => {
//   try {
//     // EXECUTE QUERY
//     // const features = new APIFeatures(Tour.find(), req.query)
//     //   .filter()
//     //   .sort()
//     //   .limitFields()
//     //   .paginate();
//     // const tours = await features.query;

//     // SEND RESPONSE

//     console.log(req.query);
//     //Advance filtering
//     let queryStr = JSON.stringify(req.query);
//     queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
//     console.log(JSON.parse(queryStr));
//     //     { difficulty: 'easy', duration: { gte: '5' } }
//     //     { difficulty: 'easy', duration: { '$gte': '5' } }

//     let query = await Tour.find(JSON.parse(queryStr));
// //pagination
// const page=req.query.page*1 || 1;
// const limit=req.query.limit*1 || 100;
// const skip =(page-1)*limit;

// query=query.skip(skip).limit(limit);

//     // if (req.query.sort) {

//     //   if (req.query.sort[0]=='-') {
//     //     let needed=JSON.stringify(req.query.sort)
//     //     needed=needed.replace('-',()=>'');
//     //     console.log(JSON.parse(needed))
//     //     query = query.sort(sortByProperty(JSON.parse(needed)));
//     //     query=query.reverse();
//     //   }
//     //   else{
//     //     query = query.sort(sortByProperty(req.query.sort));
//     //   }
//     // }
// //Field limiting
// // if(req.query.fields){
// //   const fields=req.query.fields.split(',').join(' ');
// //   query=query.select(filterbyproperty(fields))
// //   console.log(query)
// // }

//     //Executes query

//     const tours = await query;

//     res.status(200).json({
//       status: "success",
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     console.log(err)
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };


exports.getTour= factory.getOne(Tour,{path:'reviews'});

// exports.getTour =catchAsync( async (req, res,next) => {
//   // try {
//     const tour = await Tour.findById(req.params.id).populate("reviews");
//     // Tour.findOne({ _id: req.params.id })
//     if (!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         tour,
//       },
//     });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: "fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.createTour=factory.createOne(Tour);

// exports.createTour =catchAsync( async (req, res,next) => {
//   // try {
//     // const newTour = new Tour({})
//     // newTour.save()
//     console.log(req.body);
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//       status: "success",
//       data: {
//         tour: newTour,
//       },
//     });
//     console.log(newTour);
//   // } catch (err) {
//   //   console.log(err);
//   //   res.status(400).json({
//   //     status: "fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.updateTour=factory.updateOne(Tour)

// exports.updateTour =catchAsync( async (req, res) => {
//   // try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         tour,
//       },
//     });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: "fail",
//   //     message: err,
//   //   });
//   // }
// });


exports.deleteTour=factory.deleteOne(Tour);


// exports.deleteTour =catchAsync( async (req, res,next) => {
//   // try {
//    const tour= await Tour.findByIdAndDelete(req.params.id);
//     console.log(req.params.id);
//     if (!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: "fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// exports.reviewOfOneTour=catchAsync(async(req,res,next)=>{
//   const tourId=req.params.id ;
//   const tour=Tour.findById(tourId);
//   if (!tour) {
//     return next(new AppError('No user found on this Id',401));

//   }
//   const rev=Review.findOne({tour:tourId})
//   res.status(201).json({
//     status:'sucess',
//     length:rev.length,
//     body:{
//       data:rev
//     }
//   })

// })


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi

exports.getToursWithin=catchAsync(async(req,res,next)=>{
  const {distance,latlng,unit}=req.params;
  const [lat,lng]=latlng.split(',');
  const radius= unit==='mi'? distance/3963.2 : distance/6378.1;

  console.log(distance,lat,lng,radius)
  if(!lat || !lng){
    next(new AppError('Please provide latitude and longitude in formate of lat,lng',400));

  }
  const tours=await Tour.find({
    startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
  });
  res.status(200).json({
    status:'sucess',
    results:tours.length,
    data:{
      data:tours
    }
  })
})

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        //add new field distance
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    //Only those field needed
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

exports.getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1;
  try {
    let plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          num: { $sum: 1 },
          name: { $push: "$name" },
        },
      },
      {
        $sort: { num: -1 },
      },
      // {
      //   $limit: 6,
      // },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        length: plan.length,
        plan,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
