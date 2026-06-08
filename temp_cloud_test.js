const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('cloud_name=' + cloudinary.config().cloud_name);
console.log('api_key=' + (cloudinary.config().api_key ? 'present' : 'missing'));
console.log('secret=' + (cloudinary.config().api_secret ? 'present' : 'missing'));
cloudinary.uploader.upload('https://placekitten.com/200/300', { folder: 'wonderlust_test' })
  .then(res => { console.log('upload OK'); console.log(res.secure_url); process.exit(0); })
  .catch(err => { console.error('upload ERR', err.message); process.exit(1); });
