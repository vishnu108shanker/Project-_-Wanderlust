const express = require("express");
const router = express.Router();
const User = require("../models/user"); // import your User model
const passport = require("passport") ;
const { isLoggedIn, saveRedirectUrl } = require("../middlewares/isLoggedIn");
// Signup page
router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});


// Handle signup
router.post("/signup", async (req, res) => {
  try {
    let { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/signup");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already registered");
      return res.redirect("/signup");
    }

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password); // <-- Passport-local-mongoose handles hashing

    // auto-login after signup
    req.login(registeredUser, (err) => {   
      if (err) return next(err);
       const redirectUrl = req.session.returnTo || "/listings";
  delete req.session.returnTo;
  req.flash("success", `Welcome ${registeredUser.username} to WANDERLUST`);
  res.redirect(redirectUrl);
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/signup");
  }
});


// Login page
router.get("/login" , async(req, res)=>{
    res.render("login.ejs") ;
})

router.post(
  "/login",
  saveRedirectUrl ,
   passport.authenticate("local" ,  {
    failureRedirect: "/login",
    failureFlash: true,
  }) ,
   async (req, res)=>{
  req.flash("success", "Welcome back!");
res.redirect(res.locals.redirectUrl || "/listings");
  }
)

//logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
});





module.exports = router;
