const pkg = require('multer-storage-cloudinary');
console.log('pkg', pkg);
console.log('pkg.CloudinaryStorage', typeof pkg.CloudinaryStorage, pkg.CloudinaryStorage ? true : false);
console.log('pkg.default', typeof pkg.default, pkg.default ? true : false);
console.log('pkg.createCloudinaryStorage', typeof pkg.createCloudinaryStorage, pkg.createCloudinaryStorage ? true : false);
