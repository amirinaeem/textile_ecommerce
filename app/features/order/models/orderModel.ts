/*
 ──────────────────────────────────────────────────────────────────────────────────
                                Order Model
                            -----------------------------
 This Mongoose model defines the structure for customer orders.

 Fields:
   user: Reference to the user who placed the order.
   products: Array of ordered products with details like size, quantity, price, status, and completion date.
   shippingAddress: Object containing full shipping details.
   paymentResult: Object containing payment transaction details.
   total: Total order amount (required).
   totalBeforeDiscount: Total before applying any coupon.
   couponApplied: Coupon code applied (if any).
   shippingPrice: Cost of shipping (default 0).
   taxPrice: Tax amount (default 0).
   isPaid: Payment status (default false).
   totalSaved: Total savings from discounts or coupons.
   razorpay_order_id: Razorpay order ID.
   razorpay_payment_id: Razorpay payment ID.
   paidAt: Date when the order was paid.
   deliveredAt: Date when the order was delivered.
   isNew: Flag indicating a newly created order (default true).
   timestamps: Automatically tracks creation and last update times.
 ──────────────────────────────────────────────────────────────────────────────────
*/

import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
        },
        vendor: {
          type: Object,
        },
        image: {
          type: String,
        },
        size: {
          type: String,
        },
        qty: {
          type: Number,
        },
        color: {
          color: String,
          image: String,
        },
        price: {
          type: Number,
        },
        status: {
          type: String,
          default: "Not Processed",
        },
        productCompletedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    shippingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      phoneNumber: { type: String },
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    paymentResult: {
      id: String,
      status: String,
      email: String,
    },
    total: {
      type: Number,
      required: true,
    },
    totalBeforeDiscount: {
      type: Number,
    },
    couponApplied: {
      type: String,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    totalSaved: {
      type: Number,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
