/*======================================================================================
 * File: categoryLogic.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -----------------------------------------------------------------------------
 * Pure business logic for vendor category management.
 * - No error handling: errors bubble up to controllers.
 * - Handles DB operations, slug generation, and Cloudinary image handling.
 * - Always returns fresh category list sorted by `updatedAt`.
======================================================================================*/

"use server";

import Category from "@/app/features/category/models/categoryModel";
import slugify from "slugify";
import cloudinary from "@/app/core/cloudinary/config/cloudinaryCfg";
import { uploadFileToCloudinary } from "@/app/core/cloudinary/service/cloudinaryService";



// *======================================================================================
// Create Category
// *======================================================================================


const createCategoryLogic = async (name: string, images: string[]) => {

  const existing = await Category.findOne({ name });

  if (existing) {
    console.debug("Category already exists:", name);
    throw new Error("Category already exists, try a different name.");
  }

  const uploadedImages = await Promise.all(images.map(img => uploadFileToCloudinary(img)));
  console.debug("Uploaded images:", uploadedImages);

  const imageUrls = uploadedImages.map(img => ({ url: img.secure_url, public_id: img.public_id }));
  console.debug("Mapped image URLs:", imageUrls);

  const category = new Category({ name, slug: slugify(name), images: imageUrls });

  await category.save();
  console.debug("Category saved:", category);

  const categories = await Category.find().sort({ updatedAt: -1 });
  console.debug("All categories after create:", categories);

  return categories;

};



// *======================================================================================
// Delete Category
// *======================================================================================


const deleteCategoryLogic = async (id: string) => {

  const category = await Category.findByIdAndDelete(id);
  
  if (!category) {
    console.debug("Category not found with ID:", id);
    throw new Error("Category not found");
  }

  console.debug("Deleting images from Cloudinary:", category.images);
  await Promise.all(category.images.map((img: any) => cloudinary.uploader.destroy(img.public_id)));

  const categories = await Category.find().sort({ updatedAt: -1 });
  console.debug("All categories after delete:", categories);

  return categories;
};



// *======================================================================================
// Update Category
// *======================================================================================


const updateCategoryLogic = async (id: string, name: string) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    console.debug("Category not found for update with ID:", id);
    throw new Error("Category not found");
  }

  console.debug("Updated category:", category);

  const categories = await Category.find().sort({ updatedAt: -1 });
  console.debug("All categories after update:", categories);

  return categories;
};



// *======================================================================================
// Get All Categories
// *======================================================================================


const getAllCategoriesLogic = async () => {
  const categories = await Category.find().sort({ updatedAt: -1 });
  console.debug("Fetched all categories:", categories);

  return categories;
};




//*======================================================================================


export {
  createCategoryLogic,
  deleteCategoryLogic,
  updateCategoryLogic,
  getAllCategoriesLogic,
};
