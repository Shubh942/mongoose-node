const mongoose=require("mongoose")
const express=require("express");
const path=require("path");
const tourRouter = require('./routes/tourRoutes');

const app=express();

app.use(express.json());


app.use('/api/v1/tours', tourRouter);
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