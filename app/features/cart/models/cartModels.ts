/*
 ──────────────────────────────────────────────────────────────────────────────────
                                Cart Model
                            -----------------------------
 This Mongoose model defines the structure for a user's shopping cart.
 Fields:
   products: An array of product items with details like size, quantity,
   cartTotal: The total cost before discounts.
   totalAfterDiscount: The total cost after discounts.
   user: The reference to the user who owns the cart.
  ───────────────────────────────────────────────────────────────────────────────────
 */

  import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

// Define schema
const cartSchema = new mongoose.Schema(
  {
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
          type: String,
        },
        color: {
          color: String,
          image: String,
        },
        price: Number,
      },
    ],

    cartTotal: Number,
    totalAfterDiscount: Number,

    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } 
);


const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);


export default Cart;




//────────────────────────────────────────────────────────────────────────────

