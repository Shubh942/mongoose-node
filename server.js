const mongoose=require("mongoose")
const express=require("express");
const path=require("path");
const database_local='mongodb://localhost:27017/natours-test'

const app=require('./app');
mongoose.set('strictQuery', true);

mongoose.connect(database_local,{
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false
}).then(()=> console.log(`Connection sucessfully`))

app.listen('3000',()=>{
    console.log("Listining...")
})