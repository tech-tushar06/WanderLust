const joi = require("joi");

const listingSchema = joi.object({
    listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().allow('', null),
    image: joi.string().allow("", null) // Allow empty string or null for image field
}).required(),
});


const reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required().unknown(true)
});

module.exports = { listingSchema, reviewSchema };