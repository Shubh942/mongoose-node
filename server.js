const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const database_local = "mongodb://localhost:27017/natours-test";

const app = require("./app");
mongoose.set("strictQuery", true);

mongoose
  .connect(database_local, {
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false
  })
  .then(() => console.log(`Connection sucessfully`));

app.listen("3000", () => {
  console.log("Listining...");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
