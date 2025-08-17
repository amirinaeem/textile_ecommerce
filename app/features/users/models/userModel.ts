/*
 ────────────────────────────────────────────────────────────────────────────────
                                User Model
                            -----------------------------
 This Mongoose model defines the structure for user accounts.

 Fields:
   clerkId: Unique identifier from Clerk (required).
   email: User's email address (required and unique).
   image: User profile image URL (required).
   role: Role of the user (default is "user").
   defaultPaymentMethod: Default payment method for the user.
   address: Object containing:
       - firstName, lastName
       - phoneNumber
       - address1, address2
       - city, zipCode, country
       - active: Boolean to indicate if this address is active (default true)
   timestamps: Automatically tracks creation and last update times.
 ────────────────────────────────────────────────────────────────────────────────
*/

import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    defaultPaymentMethod: {
      type: String,
      default: "",
    },
    address: {
      firstName: { type: String },
      lastName: { type: String },
      phoneNumber: { type: String },
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      zipCode: { type: String },
      country: { type: String },
      active: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;



// ────────────────────────────────────────────────────────────────────────────────
