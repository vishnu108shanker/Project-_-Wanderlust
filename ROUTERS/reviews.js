// routes/reviews.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
// const Listing = require('../models/listing');
// const Review = require('../models/review');
const { isLoggedIn , validateReview} = require("../middlewares/isLoggedIn");
const reviewController = require("../COLLECTORS/review_functions") ;

// setting up the post route for review on each listing 
router.post("/",isLoggedIn, validateReview ,  wrapAsync(reviewController.postReview));

// Delete a review from both Review collection and the reviews array inside Listing.
router.delete("/:reviewId",isLoggedIn, wrapAsync(reviewController.deleteReview));



module.exports = router;
