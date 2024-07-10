const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
// Sign-In Route
router.post("/Sign-In", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if username or email already exists
    const existingUser = await User.findOne({ username: username });
    const existingEmail = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (username.length < 4) {
      return res.status(400).json({ message: "Username should have at least 4 characters" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashpass = await bcrypt.hash(password,10);

    // Create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashpass ,
    });

    await newUser.save();
    return res.status(200).json({ message: "Sign-In successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
});

router.post("/log-In", async (req, res) => {
    const { username,password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      bcrypt.compare(password,existingUser.password, (err,data) =>{
        if(data){
            const authClaims=[{name:username},{jti:jwt.sign({},"tcmTM")}]
            const token=jwt.sign({authClaims},"tcmTM" ,{expiresIn :"2d"});
            res.status(200).json({id:existingUser._id,token:token});
        }
        else{
            return res.status(400).json({ message: "Invalid credentials" });
        }
      })
});

module.exports = router;
