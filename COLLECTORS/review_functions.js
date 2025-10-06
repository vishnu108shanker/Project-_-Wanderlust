const Listing = require('../models/listing');
const Review = require('../models/review');


module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    const review = new Review(req.body);  // expects { rating, comment }
    review.author = req.user._id ;  // associate review with logged-in user
    await review.save();

    listing.reviews.push(review);  // connect review to listing
    await listing.save();
    console.log(review.author) ;
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // remove review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // delete the actual review
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}