const mongoose = require("mongoose");

const connectToDatabase = async () => {
  if (process.env.NODE_ENV === "development") {
    await mongoose.connect(process.env.DATABASE_URI_DEV);
    console.log("connected to dev database");
  } else {
    await mongoose.connect(process.env.DATABASE_URI_DEV);
    console.log("connected to prod database");
  }
};

module.exports = connectToDatabase;
