const Listing = require("../models/listing");   
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const { geocodeAddress } = require('../utils/geocode');

module.exports.index = async (req, res) => {
  console.log('Seeding DB and fetching data...');
  // await initDB();  // clears old and inserts new sample data
  let datum = await Listing.find({})  // fetch fresh data
  // res.send(datum );  // send as JSON
  res.render('index.ejs' , {datum}) ;
}

module.exports.renderNewForm = (req, res) => {
  res.render('new.ejs') ;
  console.log("New listing form rendered");
} ;

module.exports.createNewListing = async (req, res, next) => {
    // If your form sends JSON string for image, parse it
    if (typeof req.body.image === "string") {
        try {
            req.body.image = JSON.parse(req.body.image);
        } catch (err) {
            return next(new ExpressError(400, "Invalid image format"));
        }}

    // Validate with Joi
    const { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error);
        return next(new ExpressError(400, error.details.map(el => el.message).join(", ")));
    }
    // If valid, create new listing
    const newList = req.body;
   newList.owner = req.user._id ;
    await Listing.create(newList);

    req.flash("success" , "Listing has been created") ;
    res.redirect('/listings');
}

module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) return res.status(404).send("Listing not found");

    let coords;
    try {
        coords = await geocodeAddress(listing.location);
    } catch (err) {
        console.log("Geocoding failed, using default coords:", err.message);
        coords = { lat: 20.5937, lng: 78.9629 }; // fallback
    }

    res.render("show.ejs", { listing, coords });
};

module.exports.renderUpdateForm = async(req, res )=> {
  let listing = await Listing.findById(req.params.id) ;
  res.render('update.ejs' , {listing }) ;
  console.log(`update route form delivered for ${req.params.id}`) ;
}

module.exports.updatelisting = async (req, res, next) => {
  const { id } = req.params; 
  let listing = await Listing.findByIdAndUpdate(id, req.body, {
    new: true, // return updated document
    runValidators: true, // run mongoose validators
  });
    req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
}