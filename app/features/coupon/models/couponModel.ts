/*
 ──────────────────────────────────────────────────────────────────────────────────
                                Coupon Model
                            -----------------------------
 This Mongoose model defines the structure for discount coupons.

 Fields:
   coupon: Unique coupon code (uppercase, trimmed, required, length 4–10).
   vendor: Vendor name associated with the coupon.
   startDate: Coupon validity start date.
   endDate: Coupon validity end date.
   discount: Discount value (numeric).
   timestamps: Automatically tracks creation and last update times.
 ──────────────────────────────────────────────────────────────────────────────────
*/

import mongoose from "mongoose";

const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    coupon: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: true,
      minLength: 4,
      maxLength: 10,
    },
    vendor: {
      type: String,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    discount: { 
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;



//──────────────────────────────────────────────────────────────────────────────────