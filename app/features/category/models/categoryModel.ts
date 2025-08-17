/*
 ──────────────────────────────────────────────────────────────────────────────────
                                Category Model
                            -----------------------------
 This Mongoose model defines the structure for a product category.

 Fields:
   name: Category name (unique and required).
   images: Array of image objects containing URL and public ID.
   slug: Unique, lowercase identifier used for URLs and indexing.
   vendor: Vendor details (flexible object type).
   timestamps: Automatically tracks creation and last update times.
 ──────────────────────────────────────────────────────────────────────────────────
*/

import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    vendor: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;



//──────────────────────────────────────────────────────────────────────────────────