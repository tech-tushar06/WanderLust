const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');
const { isLoggedIn, validateReview, isOwner, isReviewAuthor } = require('../middlewares.js');
const reviewsController = require('../controllers/reviews.js');



// Create review
router.post('/:id/reviews', isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

// Delete review
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;
