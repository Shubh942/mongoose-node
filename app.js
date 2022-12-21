const mongoose=require("mongoose")
const express=require("express");
const path=require("path");
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError=require('./utils/appError');
const globalErrorController=require('./controllers/errorController')
const app=express();

app.use(express.json());


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req,res,next)=>{

    const er=new AppError(`Can't find ${req.originalUrl} on server`,404);
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on server`
    // })
    next(er);
   
});

app.use(globalErrorController);
// const testTour=new Tour({
//     name:'The forest hiker',
//     rating:4.7,
//     price:497
// })

// testTour.save().then(doc=>{
//     console.log(doc)
// }).catch(err=>{
//     console.log(err)
// })

module.exports=app;