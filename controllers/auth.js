const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");


const User = require("../models/user.js");



//** AUTH ROUTES **//

/* get routes */
    // route to sign-up page
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
    // route to sign-in page
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
  });
  // sign out and redir to home
router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});  
/* get routes */

/* post routes */
    // route to post sign-up credentials
router.post("/sign-up", async (req, res) => {
    // checking for username uniqueness
    const userInDb = await User.findOne({ username: req.body.username });
    if (userInDb) {
        return res.send("Sorry, that username is already taken.");
    }

    // pwd confirmation check
    if (req.body.password !== req.body.confirmPwd) {
        return res.send("Password and Confirm Password must match");
      }      
    
    // encrypt pwd
    const hashedPwd = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPwd;

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`);
});

// route to sign user in
router.post("/sign-in", async (req, res) => {
      
  //user db validation
  const userInDb = await User.findOne({ username: req.body.username });
  if (!userInDb) {
    return res.send("Login failed. Please try again.");
  }
  
  // pwd validation
  const pwdValid = bcrypt.compareSync(
      req.body.password,
      userInDb.password
    );
    if (!pwdValid) {
      return res.send("Login failed. Please try again.");
    }
  
  // make a session
  req.session.user = {
      username: userInDb.username,
      _id: userInDb._id
  };
  // save session
  req.session.save(() =>{
    res.redirect("/");
  });
});
/* post routes */

//** AUTH ROUTES **// 

module.exports = router;