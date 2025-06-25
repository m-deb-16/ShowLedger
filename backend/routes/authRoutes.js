const User = require("../models/User"); //the User inside the parenthesis should just match the file name, doesnt have anything to do with the export name in the user file, Mongoose model to save and fetch users
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router(); //creates a mini Express app, just for handling a group of routes.

router.post("/register", async (req, res) => {
  //async because theres an await inside
  //await stops the flow until the promise is fullfilled
  try {
    const { username, email, password } = req.body; //retrieves the username, password and email from the body which is sent after clicking register on the register form  (object destructuring, same as doing const username = req.body.username; and so on)

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" }); //if user found then immediately stop, return HTTP status 400 (Bad Request) with a message.

    //hashing the pw
    const salt = await bcrypt.genSalt(10); //generating a salt (random string to make the hash more secure) 10 → cost factor (higher = slower = more secure)

    const passwordHash = await bcrypt.hash(password, salt); //take the user’s plain text password, add the salt, and generate a hash — this is what will be stored in DB

    //create new user but doesnt save it yet
    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    await newUser.save(); //saves the new user in the DB, await used so that flow waits for completion

    //generate a jwt token, method signarture is jwt.sign(payload, secret, options)
    const token = jwt.sign(
      { userId: newUser._id }, //this lets the token carry who the user is
      process.env.JWT_SECRET,
      { expiresIn: "1h" } //Token will expire in 1 hour
    );

    res.json({ token }); //send the token back to the client (browser / React app) in a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    } else {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.statur(500).json({ message: "Server error" });
  }
});

module.exports = router;
