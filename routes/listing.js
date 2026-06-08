const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage});
const listingsController = require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing,
wrapAsync(listingsController.createListing));



// New route to display form for creating a new listing
router.get('/new', isLoggedIn, listingsController.newListingForm);

router.route("/:id")
.get( wrapAsync(listingsController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,
wrapAsync(listingsController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));


// Edit route to display form for editing an existing listing
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingsController.editListing));

module.exports = router;