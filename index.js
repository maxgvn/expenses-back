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
  name: String,
  expensestotal: Number,
  isDone: Boolean
});

const Expense = mongoose.model("Expense", {
  name: String,
  isDone: Boolean
});

app.get("/users", async (req, res) => {
  try {
    const Users = await User.find();
    res.json(Users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/usercreate", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      expensestotal: 0,
      isDone: false
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// app.post("/update", async (req, res) => {
//   try {
//     // 1) Récupérer l'objet à modifier depuis la base mongodb
//     const task = await Task.findById(req.query.id);
//     if (task) {
//       // 2) Modifier l'objet
//       if (req.body.name !== undefined) {
//         task.name = req.body.name;
//       }
//       if (req.body.isDone !== undefined) {
//         task.isDone = req.body.isDone;
//       }

//       // 3) Sauvegarder l'objet modifié
//       await task.save();

//       res.json(task);
//     } else {
//       res.status(404).json({ message: "Task not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post("/delete", async (req, res) => {
//   try {
//     // 1) Récupérer l'objet à modifier depuis la base mongodb
//     const task = await Task.findById(req.query.id);
//     if (task) {
//       // 3) Supprimer l'objet modifié
//       await task.remove();

//       res.json(task);
//     } else {
//       res.status(404).json({ message: "Task not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`Current environment is ${process.env.NODE_ENV}`);
});
