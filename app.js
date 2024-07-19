const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signin", (req, res) => {
  res.render("Login");
});

app.post("/signup", async (req, res) => {
  const { Username, Name, Email, Password, Age } = req.body;
  let user = await userModel.findOne({ email: Email });

  if (user) return res.status(400).render("goToLogin");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(Password, salt, async (err, hash) => {
      let user = await userModel.create({
        username: Username,
        name: Name,
        email: Email,
        password: hash,
        age: Age,
      });
      let token = jwt.sign({ email: Email, userid: user._id }, "shhh");
      res.cookie("token", token);
      res.render("registrationSuccess"); // Corrected here
    });
  });
});

app.post("/signin", async (req, res) => {
  const { Username, Name, Email, Password, Age } = req.body;
  let user = await userModel.findOne({ email: Email });

  if (user) return res.status(400).send("User already registered");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(Password, salt, async (err, hash) => {
      let user = await userModel.create({
        username: Username,
        name: Name,
        email: Email,
        password: hash,
        age: Age,
      });
      let token = jwt.sign({ email: Email, userid: user._id }, "shhh");
      res.cookie("token", token);
      res.send("registered successfully");
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
