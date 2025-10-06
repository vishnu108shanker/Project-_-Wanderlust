const express = require("express");
const router = express.Router();
// const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const listingController = require("../COLLECTORS/listing_functions.js")
;

//  const { Listing, wrapAsync, ExpressError, listingSchema } = require("../utils/required");

router.route('/')
//setting up the index route
.get( wrapAsync(listingController.index))
// route to post new listing
.post( wrapAsync( listingController.createNewListing ) ) ;



// route to create new listing
//Always place static routes (/new, /something) above dynamic routes (/:id).
router.get('/new' ,isLoggedIn, listingController.renderNewForm ) ;


router.route('/:id')
// setting up the show route
.get( wrapAsync(listingController.showListing))
// putting an update route 
.put( wrapAsync(listingController.updatelisting))
// delete route
.delete(isLoggedIn, wrapAsync(listingController.deleteListing)) ;


 // creating an update route 
router.get('/:id/update' ,isLoggedIn, wrapAsync(listingController.renderUpdateForm)) ;

// //setting up the index route
// router.get('/', wrapAsync(listingController.index));



// router.post('/', wrapAsync( listingController.createNewListing ) ) ;


// // setting up the show route
// router.get("/:id", wrapAsync(listingController.showListing));


// // creating an update route 
// router.get('/:id/update' ,isLoggedIn, wrapAsync(listingController.renderUpdateForm)) ;
// router.put('/:id' , wrapAsync(listingController.updatelisting));

// // delete route
// router.delete('/:id', isLoggedIn, wrapAsync(listingController.deleteListing)) ;



module.exports = router;
