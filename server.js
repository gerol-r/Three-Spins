//** DEPENDENCIES **//
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const userSignedIn = require('./middleware/user-signed-in.js');
const userToView = require('./middleware/user-to-view.js');


const profileController = require('./controllers/profile.js');
const authController = require("./controllers/auth.js");
//** DEPENDENCIES **//

//** port **//
const port = process.env.PORT ? process.env.PORT : "3005";
//** port **//

//** database connection **//
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
});
//** database connection **//

//** MIDDLEWARE **//

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use("/utilities", express.static(path.join("utilities")));
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
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);
// Serve flash messages
app.use(flash());
// userToView middleware
app.use(userToView);
//** MIDDLEWARE **//

//** ROUTES **//
app.get('/', (req, res) => {
    // Check if the user is signed in
    if (req.session.user) {
        // Redirect signed-in users to their profile/ songs index
        res.redirect(`/users/${req.session.user._id}/profile`);
    } else {
        // Show the homepage for users who are not signed in
        res.render('index.ejs');
    }
});

//** ROUTES **//

//** more middleware **//
// auth middleware
app.use('/auth', authController);
// userSignedIn middleware 
app.use(userSignedIn);
//profile middleware
app.use('/users/:userId/profile', profileController);
//** more middleware **//

app.listen(port, () => {
});
