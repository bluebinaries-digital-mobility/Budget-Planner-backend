// exports.envConfig = () => {
//   const dotenv = require("dotenv");
//   dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
// };

const dotenv = require('dotenv');
const path = require('path');

exports.envConfig = () => {
  // Resolve the path to the .env file based on NODE_ENV
  const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'dev'}`);
  console.log(`Loading environment variables from ${envPath}`);
  
  // Load environment variables from the resolved .env file
  dotenv.config({ path: envPath });
};

