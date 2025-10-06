const mongoose = require("mongoose");

const Schema = mongoose.Schema;

                        const reviewSchema = new Schema({
                            comment: {
                                type: String,
                                required: true,
                                trim: true
                            },

                            rating: {
                                type: Number,
                                min: 1,
                                max: 5,
                                required: true
                            },

                            created_at: {
                                type: Date,
                                default: Date.now
                            },

                            listing: {
                                type: Schema.Types.ObjectId,
                                ref: "Listing"   // optional: only if you want reverse linking
                            } ,
                            author: {
                                type: Schema.Types.ObjectId,
                                ref: "User"
                            }
                        });

// Export Review model
module.exports = mongoose.model("Review", reviewSchema);
