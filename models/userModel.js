const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name  is required"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Email is invalid"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      maxLength: [20, "Password cannot exceed 20 characters"],
      required: [true, "Password is required"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Passwords do not match",
      },
    },
    passwordResetToken: String,
    passwordResetExpireDate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
