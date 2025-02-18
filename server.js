//** DEPENDENCIES **//
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const isSignedIn = require('./middleware/user-signed-in.js');
const userToView = require('./middleware/user-to-view.js');

const authController = require("./controllers/auth.js");

//** DEPENDENCIES **//

// Set the port from environment variable
const port = process.env.PORT ? process.env.PORT : "3005";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
//** MIDDLEWARE **//
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
//integrate session management 
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
// userToView middleware
app.use(userToView); 
//** MIDDLEWARE **//
//** ROUTES **//
app.get("/", (req, res) => {
    res.render("index.ejs", {
      user: req.session.user,
    });
  });
  
//** ROUTES **//

app.use("/auth", authController);
// userSignedIn middleware 
app.use(userSignedIn); 

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
