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

const User = mongoose.model("User", {
  name: { type: String, minlength: 1, maxlength: 20, required: true },
  expensestotal: Number
});

const Expense = mongoose.model("Expense", {
  Description: { type: String, minlength: 2, maxlength: 20, required: true },
  Amount: Number,
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const Users = await User.find();
    res.json(Users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/usercreate", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/expenses", async (req, res) => {
  try {
    const Expenses = await Expense.find().populate("User");
    res.json(Expenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/expensecreate", async (req, res) => {
  try {
    const newExpense = new Expense({
      Description: req.body.description,
      Amount: req.body.amount,
      User: req.body.user
    });

    await newExpense.save();
    res.json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/deleteexpense", async (req, res) => {
  console.log(req.query.id);
  try {
    const expensetodelete = await Expense.findById(req.query.id);
    console.log(expensetodelete);
    if (expensetodelete) {
      await expensetodelete.remove();
      console.log(expensetodelete);
      res.json(expensetodelete);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`Current environment is ${process.env.NODE_ENV}`);
});
