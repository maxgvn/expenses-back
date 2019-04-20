require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/expenses-back",
  {
    useNewUrlParser: true
  }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connection active");
});

// CREATE FIVE CHAR HASH //

app.post("/api/shorten", async (req, res, next) => {
  const originalUrl = req.body.originalUrl;
  const shortBaseUrl = "https://short-url-max-gavanon.herokuapp.com";
  console.log(originalUrl, "original");
  if (validUrl.isUri(originalUrl)) {
  } else {
    return res.status(401).json("Invalid Base Url");
  }

  const urlCode = Math.random()
    .toString(36)
    .slice(2, 7);

  const updatedAt = new Date();

  if (validUrl.isUri(originalUrl)) {
    try {
      const item = await shortURL.findOne({ originalUrl: originalUrl });
      if (item) {
        res.status(200).json(item);
      } else {
        shortUrl = shortBaseUrl + "/" + urlCode;
        const item = new shortURL({
          originalUrl,
          shortUrl,
          urlCode,
          updatedAt
        });
        await item.save();
        res.status(200).json(item);
      }
    } catch (err) {
      res.status(401).json("Invalid Url");
    }
  } else {
    return res.status(401).json("Invalid Url");
  }
});

app.get("/:code", async (req, res) => {
  const urlCode = req.params.code;
  const item = await shortURL.findOne({ urlCode: urlCode });
  if (item) {
    return res.redirect(item.originalUrl);
  } else {
    return res.redirect(errorUrl);
  }
});

app.get("/api/links", async (req, res) => {
  const arrayLinks = await shortURL.find();
  console.log(arrayLinks, "check");
  return res.json(arrayLinks);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`Current environment is ${process.env.NODE_ENV}`);
});
