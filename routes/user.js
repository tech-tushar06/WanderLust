const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const { isLoggedIn } = require("../middlewares.js");
const usersController = require("../controllers/users.js");


router.route("/signup")
.get(usersController.renderSignupForm)
.post(wrapAsync(usersController.signup));


router.route("/login")
.get( usersController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}), usersController.login);



router.get("/logout", isLoggedIn, usersController.logout);

module.exports = router;