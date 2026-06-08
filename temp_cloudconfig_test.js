const { cloudinary, storageType } = require('./cloudconfig.js');
console.log('storageType=', storageType);
console.log('cloud_name=' + cloudinary.config().cloud_name);
console.log('api_key=' + (cloudinary.config().api_key ? 'present' : 'missing'));
console.log('secret=' + (cloudinary.config().api_secret ? 'present' : 'missing'));
console.log('storage obj', storageType, storageType === 'cloudinary' ? 'cloudinary enabled': 'local enabled');
