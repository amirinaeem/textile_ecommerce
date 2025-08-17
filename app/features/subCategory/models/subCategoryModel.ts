/*
 ────────────────────────────────────────────────────────────────────────────────
                              SubCategory Model
                            -----------------------------
 This Mongoose model defines the structure for subcategories under a main category.

 Fields:
   name: Name of the subcategory (unique and required).
   slug: URL-friendly unique identifier for the subcategory.
   images: Array of images with URL and public identifier.
   vendor: Object containing vendor information.
   parent: Reference to the parent Category (required).
   timestamps: Automatically tracks creation and last update times.
 ────────────────────────────────────────────────────────────────────────────────
*/

import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    images: [
      {
        url: String,
        public_url: String,
      },
    ],
    vendor: {
      type: Object,
    },
    parent: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const SubCategory =
  mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;




//────────────────────────────────────────────────────────────────────────────────