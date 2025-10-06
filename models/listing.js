const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  image: {
    url: String,
    filename: String
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }] ,
  
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
});

module.exports = mongoose.model("Listing", listingSchema);
