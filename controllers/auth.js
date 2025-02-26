const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const getRandomAvatar = require("../utilities/avatar.js");

const User = require("../models/user.js");



//** AUTH ROUTES **//

/* get routes */
// route to sign-up page
router.get("/sign-up", (req, res) => {
  const messages = req.flash("error");
  res.render("auth/sign-up.ejs", { messages });
});
// route to sign-in page
router.get("/sign-in", (req, res) => {
  const messages = req.flash("error");
  res.render("auth/sign-in.ejs", { messages });
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
  try {
    // checking for username uniqueness
    const userInDb = await User.findOne({ username: req.body.username });
    if (userInDb) {
      req.flash("error", "Username taken. Please try again.");
      return res.redirect("/auth/sign-up");
    }

    // pwd confirmation check
    if (req.body.password !== req.body.confirmPwd) {
      req.flash("error", "Password and Confirm Password must match");
      return res.redirect("/auth/sign-up");
    }

    // encrypt pwd
    const hashedPwd = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPwd;

    // Assign a random avatar
    req.body.avatar = getRandomAvatar();

    const user = await User.create(req.body);

    req.session.user = {
      _id: user._id, 
      username: user.username,
    };

    req.session.save(() => {
      res.redirect(`/users/${user._id}/profile`);
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    req.flash("error", "An error occurred. Please try again."); // Set flash message
    res.redirect("/auth/sign-up"); // Redirect to sign-in page
  }
});

// route to sign user in
router.post("/sign-in", async (req, res) => {
  try {
    //user db validation
    const userInDb = await User.findOne({ username: req.body.username });
    if (!userInDb) {
      req.flash("error", "Login failed. Please try again.");
      return res.redirect("/auth/sign-in");
    }

    // pwd validation
    const pwdValid = bcrypt.compareSync(
      req.body.password,
      userInDb.password
    );
    if (!pwdValid) {
      req.flash("error", "Login failed. Please try again.");
      return res.redirect("/auth/sign-in");
    }

    // make a session
    req.session.user = {
      username: userInDb.username,
      _id: userInDb._id
    };
    // save session
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    req.flash("error", "An error occurred. Please try again."); // Set flash message
    res.redirect("/auth/sign-in"); // Redirect to sign-in page
  }
});
/* post routes */

//** AUTH ROUTES **// 

module.exports = router;