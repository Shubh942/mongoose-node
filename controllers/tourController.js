const Tour = require("./../model/tourmodel");
// const APIFeatures = require('./../utils/apiFeatures');
const mongoose = require("mongoose");
// const { query } = require('express');


function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}

// function filterbyproperty(property) {
//   return function (a) {
//     return a.property

//     return 0;
//   };
// }










// exports.getAllTours = async (req, res) => {
//   try {
//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     const tours = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    // const features = new APIFeatures(Tour.find(), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate();
    // const tours = await features.query;

    // SEND RESPONSE

    console.log(req.query);
    //Advance filtering
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    //     { difficulty: 'easy', duration: { gte: '5' } }
    //     { difficulty: 'easy', duration: { '$gte': '5' } }

    let query = await Tour.find(JSON.parse(queryStr));
//Sorting

if (req.query.sort) {
  // const sortBy = req.query.sort.split(',').join(' ');
  query = query.sort(req.query.sort);
} 


    // if (req.query.sort) {
      
      
    //   if (req.query.sort[0]=='-') {
    //     let needed=JSON.stringify(req.query.sort)
    //     needed=needed.replace('-',()=>'');
    //     console.log(JSON.parse(needed))
    //     query = query.sort(sortByProperty(JSON.parse(needed)));
    //     query=query.reverse();
    //   }
    //   else{
    //     query = query.sort(sortByProperty(req.query.sort));
    //   }
    // }
//Field limiting 
// if(req.query.fields){
//   const fields=req.query.fields.split(',').join(' ');
//   query=query.select(filterbyproperty(fields))
//   console.log(query)
// }

    //Executes query
    

    const tours = await query;
    

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()
    console.log(req.body);
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
    console.log(newTour);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    console.log(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
