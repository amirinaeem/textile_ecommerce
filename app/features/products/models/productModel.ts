/*
 ────────────────────────────────────────────────────────────────────────────────
                                Product Model
                            -----------------------------
 This Mongoose model defines the structure for products in the catalog.

 Fields:
   name: Name of the product.
   description: Short description of the product.
   longDescription: Detailed description of the product.
   brand: Brand of the product.
   slug: URL-friendly unique identifier for the product.
   category: Reference to the parent category.
   subCategories: Array of references to subcategories.
   details: Array of key-value pairs for additional product details.
   benefits: Array of product benefits.
   ingredients: Array of ingredients (note: fixed spelling from 'igredients').
   reviews: Array of review subdocuments.
   rating: Average rating of the product.
   numReviews: Number of reviews for the product.
   vendor: Object containing vendor info.
   subProducts: Array of variants with SKU, images, colors, sizes, discounts, and sold counts.
   timestamps: Automatically tracks creation and last update times.
 ────────────────────────────────────────────────────────────────────────────────
*/

import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

// Review subdocument schema
const reviewSchema = new mongoose.Schema({
  reviewBy: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  review: {
    type: String,
    required: true,
  },
});

// Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
    },
    brand: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    subCategories: [
      {
        type: ObjectId,
        ref: "subCategory",
      },
    ],
    details: [
      {
        name: String,
        value: String,
      },
    ],
    benefits: [{ name: String }],
    ingredients: [{ name: String }], // fixed typo from "igredients"
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    vendor: {
      type: Object,
    },
    subProducts: [
      {
        sku: String,
        images: [],
        description_images: [],
        color: {
          color: String,
          image: String,
        },
        sizes: [
          {
            size: String,
            qty: Number,
            price: Number,
            sold: {
              type: Number,
              default: 0,
            },
          },
        ],
        discount: {
          type: Number,
          default: 0,
        },
        sold: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;





//────────────────────────────────────────────────────────────────────────────────