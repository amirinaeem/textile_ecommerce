/*
 *======================================================================================
                                 Vendor Model
                             ------------------------
 This Mongoose model defines the structure for vendors in the e-commerce app.
 Fields:
   name: Vendor's full name (required)
   email: Vendor's email address (required)
   password: Vendor's hashed password (required, not selected by default)
   description: Optional description about the vendor
   address: Vendor's physical address (required)
   phoneNumber: Contact number (required)
   role: User role (default: "vendor")
   zipCode: Postal code (required)
   availableBalance: Current balance of vendor (default: 0)
   commission: Commission rate for the vendor
   verified: Verification status (default: false)
 Methods:
   getJWTToken(): Generates JWT token for authentication
   comparePassword(): Compares entered password with hashed password
 *======================================================================================
*/

import mongoose from "mongoose";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    description: { type: String },
    address: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    role: { type: String, default: "vendor" },
    zipCode: { type: Number, required: true },
    availableBalance: { type: Number, default: 0 },
    commission: { type: Number },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);


vendorSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

vendorSchema.methods.comparePassword = async function (
    enteredPassword: String
) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
export default Vendor;



//──────────────────────────────────────────────────────────────────────────────

