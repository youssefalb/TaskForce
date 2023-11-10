/** @type {import('next').NextConfig} */
const path = require('path');
const dotenv = require('dotenv');

const nextConfig = {
  reactStrictMode: false,
}

dotenv.config({
  path: path.resolve(__dirname, '../.env'), // Adjust the path to where your .env file is located
});


module.exports = nextConfig
