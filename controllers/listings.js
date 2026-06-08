const path = require('path');
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

const filePathToUrl = (filePath) => {
    if (!filePath) return undefined;
    const normalized = filePath.replace(/\\/g, '/');
    const publicIndex = normalized.indexOf('/public/');
    if (publicIndex !== -1) {
        return normalized.slice(publicIndex + 7);
    }
    return normalized;
};

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});    
    res.render('listings/index.ejs', { allListings });
};

module.exports.newListingForm = (req, res) => {
    res.render('listings/new');
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res,next) => {
   let response = await geocodingClient
   .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();

    const listingData = req.body.listing;
    listingData.owner = req.user._id;
    const imageValue = listingData.image?.trim();
    const newListing = new Listing({
        ...listingData,
        images: imageValue ? [{ url: imageValue }] : undefined,
    });
    if (req.file) {
        newListing.image = {
            url: filePathToUrl(req.file.path),
            filename: req.file.filename,
        };
    }
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
};


module.exports.editListing = async (req, res) => {  
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload/h_300,w_250");
    res.render('listings/edit', { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError("Invalid listing data", 400);
    }
    const { id } = req.params;
    const listingData = req.body.listing;
    const imageValue = listingData.image?.trim();
    const { image, ...updateData } = listingData;
    
    // Geocode location if it was changed
    if (updateData.location) {
        let response = await geocodingClient
            .forwardGeocode({
                query: updateData.location,
                limit: 1
            })
            .send();
        updateData.geometry = response.body.features[0].geometry;
    }
    
    // Update basic fields first
    const listing = await Listing.findByIdAndUpdate(id, {
        ...updateData,
        images: imageValue ? [{ url: imageValue }] : undefined,
    }, { returnDocument: 'after', runValidators: true });

    // If a new file was uploaded, attach it to the listing and save
    if (req.file) {
        listing.image = {
            url: filePathToUrl(req.file.path),
            filename: req.file.filename,
        };
        await listing.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect('/listings');
};

