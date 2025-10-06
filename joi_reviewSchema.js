// joi_reviewSchema.js
const Joi = require("joi");

module.exports.reviewJoiSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required().min(1).max(500)
});
