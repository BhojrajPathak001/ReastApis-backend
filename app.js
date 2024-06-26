const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const MONGODB_URI = `mongodb+srv://bhojrajpathak:kcucA3wliearQpM4@cluster0.90qm6ik.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0`;
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middlware/auth");
const clearImage = require("./utilities").clearImage;
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(
  multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images"))); // yeh /images par jo bhi request jayegi usko images folder me bhej dega aur usme se images publicly availabe honge.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authenticated");
  }
  if (!req.file) {
    return res.status(200).json({ message: "NO file provided" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: "File Stored", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const data = err.data;
  const message = err.message;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `mongodb+srv://bhojrajpathak:kcucA3wliearQpM4@cluster0.90qm6ik.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then((result) => {
    console.log("mongodb connected");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
