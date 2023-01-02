const Tour=require('./../model/tourmodel')
const catchAsync = require('./../utils/catchAsync');

// exports.getOverview=async (req,res)=>{
//     tour=await Tour.find();
//     res.status(200).render('overview',{
//         // title:'Exciting tours for adventurous people',
//         tour
//     })
// }


exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();
  
    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
      title: 'All Tours',
      tours
    });
  });

exports.getTour=(req,res)=>{
    res.status(200).render('tour',{
        title:'The Forest Hiker'
    })
}