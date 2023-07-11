const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const devuser = require("./devUserModel");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const reviewModel = require("./reviewModel");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
//connection with mongoose connection
mongoose
  .connect(
    "mongodb+srv://raghukiran1414:Raghu%40123@cluster0.m82pxwz.mongodb.net/deploymentpractise?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to deployment server");
});

app.post("/register", async (req, res) => {
  try {
    const { fullname, email, mobile, skills, password, confirmpassword } =
      req.body;
    const exist = await devuser.findOne({ email });
    if (exist) {
      return res.status(400).send("User Already registered");
    }
    if (password !== confirmpassword) {
      return res.status(403).send("Password is invalid");
    }
    let newUser = new devuser({
      fullname,
      email,
      mobile,
      skills,
      password,
      confirmpassword,
    });
    newUser.save();
    return res.status(200).send("User registered");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingemail = await devuser.findOne({ email: email });
    // console.log("entered login route");
    if (!existingemail) {
      return res.status(400).send("User not exist");
    }
    if (existingemail.password != password) {
      return res.status(400).send("Password is invalid");
    }

    const payload = {
      user: {
        id: existingemail.id,
      },
    };

    jwt.sign(payload, "jwtpassword", { expiresIn: 36000000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/allprofiles", middleware, async (req, res) => {
  try {
    let allprofiles = await devuser.find();
    return res.json(allprofiles);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

app.get("/myprofile", middleware, async (req, res) => {
  console.log(req.user);
  try {
    let user = await devuser.findById(req.user.id);
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
app.post("/addreview", middleware, async (req, res) => {
  try {
    const { taskworker, rating } = req.body;
    console.log(req.body);
    const exist = await devuser.findById(req.user.id);
    const newReview = new reviewModel({
      taskprovider: exist.fullname,
      taskworker,
      rating,
    });
    newReview.save();
    return res.status(200).send("New Review Added");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});
app.get("/myreview", middleware, async (req, res) => {
  try {
    let allreviews = await reviewModel.find();
    let myreviews = allreviews.filter(
      (review) => review.taskworker.toString() === req.user.id.toString()
    );
    return res.json(myreviews);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

app.listen(1414, () => {
  console.log("Server started at Port 1414");
});
