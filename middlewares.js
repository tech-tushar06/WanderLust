const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in to do that!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
};


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    try {
        // Ensure req.body.review exists
        if (!req.body.review) {
            throw new ExpressError("Review data is missing", 400);
        }
        
        // Normalize rating to a number and support arrays from duplicate fields
        if (req.body.review.rating !== undefined) {
            let rawRating = req.body.review.rating;
            if (Array.isArray(rawRating)) {
                rawRating = rawRating[rawRating.length - 1];
            }
            const ratingValue = parseInt(rawRating, 10);
            if (isNaN(ratingValue)) {
                throw new ExpressError("Rating must be a valid number", 400);
            }
            req.body.review.rating = ratingValue;
        }
        
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(", ");
            throw new ExpressError(msg, 400);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect("/listings");
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};
