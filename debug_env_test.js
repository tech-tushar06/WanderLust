const fs = require('fs');
const path = require('path');
console.log('cwd=' + process.cwd());
console.log('__dirname=' + __dirname);
const envPath = path.join(__dirname, '.env');
console.log('.env path=' + envPath);
console.log('exists=' + fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  console.log('env contents:\n' + fs.readFileSync(envPath, 'utf8'));
}
const dotenv = require('dotenv');
const result = dotenv.config({ path: envPath });
console.log('dotenv parsed error=' + (result.error ? result.error.message : 'none'));
console.log('process.env.CLOUD_NAME=' + process.env.CLOUD_NAME);
console.log('process.env.CLOUD_API_KEY=' + process.env.CLOUD_API_KEY);
console.log('process.env.CLOUD_SECRET=' + process.env.CLOUD_SECRET);
