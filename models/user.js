const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
});

// Support both CJS and transpiled ESM default export shapes
userSchema.plugin(passportlocalMongoose.default || passportlocalMongoose);

module.exports = mongoose.model('User', userSchema);
