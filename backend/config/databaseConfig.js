const mongoose = require("mongoose");
require('dotenv').config();
const { autoSeedDatabase } = require("./seedData.js");

const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/my_database"; 

// mongoDb database connection
const databaseconnect = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(async (conn) => {
      console.log(`connected to DB: ${conn.connection.host}`);
      try {
        const Product = require('../model/productSchema.js');
        const Review = require('../model/reviewSchema.js');
        const User = require('../model/userSchema.js');
        await autoSeedDatabase({ Product, Review, User });
      } catch (seedErr) {
        // Non-blocking notice
      }
    })
    .catch((err) => console.log(err.message));
};

module.exports = databaseconnect;
