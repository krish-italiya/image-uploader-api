const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const photosMiddleWare = multer({ dest: "uploads/" });

const app = new express();
// mongoose
//   .connect("mongodb://127.0.0.1:27017/imageUploader")
//   .then(() => {
//     console.log("Mongodb Connected!");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    req.header("origin") ||
      req.header("x-forwarded-host") ||
      req.header("referer") ||
      req.header("host")
  );

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "POST");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(
  cors({
    credientials: true,
    origin:
      "https://64b3dcb32922992b620679c8--luxury-vacherin-89ddde.netlify.app/",
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());

app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/uploads", photosMiddleWare.array("photos", 10), (req, res) => {
  uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    // console.log(newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
