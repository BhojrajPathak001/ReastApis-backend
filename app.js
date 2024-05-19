const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const MONGODB_URI = `mongodb+srv://bhojrajpathak:kcucA3wliearQpM4@cluster0.90qm6ik.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0`;
const feedRoutes = require("./routes/feed");

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images"))); // yeh /images par jo bhi request jayegi usko images folder me bhej dega aur usme se images publicly availabe honge.

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("mongodb connected");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
