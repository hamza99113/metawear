const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const port = 5000;
const fs = require("fs");
const imageModel = require("./models");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://user123:hamza123@cluster0.pgi8ofh.mongodb.net/?retryWrites=true&w=majority",
    // "mongodb+srv://user123:password123@@cluster0.pgi8ofh.mongodb.net/metawear?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("connected successfully"))
  .catch((err) => console.log("it has an error", err));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api", upload.single("testImage"), (req, res) => {
  const saveImage =  imageModel({
    name: req.body.name,
    img: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
    res.send('image is saved')
});


app.get('/api',async (req,res)=>{
  const allData = await imageModel.find()
  res.json(allData)
})

app.listen(port, () => {
  console.log("SERVER running successfully");
});