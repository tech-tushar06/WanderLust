const mongoose = require('mongoose');
const initDB = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
    console.log("Connected to MongoDB");
}       ).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

async function main() {
    await mongoose.connect(MONGO_URL);   
}  

let initData = async () => {
    await Listing.deleteMany({});

    initDB.data = initDB.data.map((obj) => ({
        ...obj,
        owner: '6a184200decce4f7c1f09bd8',
        images: obj.image?.url
            ? [{ url: obj.image.url, filename: obj.image.filename }]
            : Array.isArray(obj.images)
            ? obj.images.map((img) =>
                  typeof img === 'string' ? { url: img } : img
            
              )
            : undefined,
    }));

    await Listing.insertMany(initDB.data);

    console.log("Database initialized with sample data");
};

initData();
