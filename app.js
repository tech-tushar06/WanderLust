const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");


const session = require("express-session");
const MongoStore = require('connect-mongo').default;


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));   
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));    

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create ({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE");
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
};

// app.get('/', (req, res) => { 
//     res.send('Hello Im a Root!');
// });


app.use(session(sessionOptions));
app.use((req, res, next) => {
    req.flash = (type, msg) => {
        req.session.flashMessages = req.session.flashMessages || {};

        if (msg !== undefined) {
            req.session.flashMessages[type] = req.session.flashMessages[type] || [];
            req.session.flashMessages[type].push(msg);
            return req.session.flashMessages[type];
        }

        const messages = req.session.flashMessages[type] || [];
        delete req.session.flashMessages[type];

        if (Object.keys(req.session.flashMessages).length === 0) {
            delete req.session.flashMessages;
        }

        return messages;
    };

    next();
});

// passport configuration

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Authentication middleware to check if user is logged in
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "tushar@gmail.com",
//         username: "tushar",
//     });
//     let registeredUser = await User.register(fakeUser, "tushar123");
//     res.send(registeredUser);
// });


 



// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const port = process.env.PORT || 8080;

main().then(() => {
    console.log("Connected to MongoDB");
}       ).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

async function main() {
    await mongoose.connect(dbUrl);   
}   

// app.get('/listings', async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Beautiful Beach House",
//         description: "A stunning beach house with ocean views and modern amenities.",
//         price: 500,
//         location: "Miami, FL",
//         images: ["https://www.dreamstime.com/royalty-free-stock-photography-beautiful-new-home-exterior-clear-evening-provides-setting-luxurious-image34711767"]
//     });
//     await sampleListing.save();
//     console.log("Sample listing saved to MongoDB");
//     res.send("Successfully added a sample listing to MongoDB");
// });

app.use("/listings", listingRoutes);
app.use('/listings', reviewRoutes);
// Mount user routes (handles /signup etc.)
app.use('/', userRoutes);


// Catch-all for unmatched routes — use a middleware to avoid path-to-regexp errors
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err, statusCode, message });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});