/*======================================================================================
 * Vendor SubCategory Logic
 * =======================
 * Pure business logic (no DB connect). Handles:
 * - Validation & normalization
 * - Queries & mutations with models
 * - Debug logs for flow
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/
"use server";

import cloudinary from "@/app/core/cloudinary/config/cloudinaryCfg";
import { uploadFileToCloudinary } from "@/app/core/cloudinary/service/cloudinaryService";
import slugify from "slugify";
import Category from "@/app/features/category/models/categoryModel";
import SubCategory from "@/app/features/subCategory/models/subCategoryModel";
import mongoose from "mongoose";




/*======================================================================================
 * GET ALL SUBCATEGORIES & CATEGORIES (Logic)
 *======================================================================================*/


const getAllSubCategoriesAndCategoriesLogic = async () => {
  console.debug("[getAllSubCategoriesAndCategoriesLogic]");
  const categories = await Category.find().sort({ updatedAt: -1 }).lean();
  const subCategories = await SubCategory.find()
    .populate({ path: "parent", model: Category })
    .sort({ updatedAt: -1 })
    .lean();

  return {
    success: true,
    categories: JSON.parse(JSON.stringify(categories)),
    subCategories: JSON.parse(JSON.stringify(subCategories)),
  };
};

/*======================================================================================
 * GET SINGLE SUBCATEGORY (Logic)
 *======================================================================================*/


const getSingleSubCategoryLogic = async (category?: string) => {
  if (!category) {
    return { success: false, message: "No Category provided!", subCategories: [] };
  }
  console.debug("[getSingleSubCategoryLogic] category:", category);
  const results = await SubCategory.find({ parent: category }).select("name");
  return { success: true, subCategories: JSON.parse(JSON.stringify(results)) };
};


/*======================================================================================
 * CREATE SUBCATEGORY (Logic)
 *======================================================================================*/


const createSubCategoryLogic = async (name: string, parent: string, images: any[]) => {
  console.debug("[createSubCategoryLogic] name/parent:", { name, parent });

  const exists = await SubCategory.findOne({ name });
  if (exists) {
    return { success: false, message: "Sub Category already exists." };
  }

  const uploadedImages = await Promise.all(images.map(img => uploadFileToCloudinary(img)));
  const imageUrls = uploadedImages.map(img => ({ url: img.secure_url, public_id: img.public_id }));

  const subCategory = new SubCategory({
    name,
    parent,
    slug: slugify(name, { lower: true, strict: true }),
    images: imageUrls,
  });

  await subCategory.save();
  const subCategories = await SubCategory.find().sort({ updatedAt: -1 });

  return {
    success: true,
    message: `Sub Category ${name} has been successfully created.`,
    subCategories: JSON.parse(JSON.stringify(subCategories)),
  };
};


/*======================================================================================
 * DELETE SUBCATEGORY (Logic)
 *======================================================================================*/


const deleteSubCategoryLogic = async (id: string) => {

  interface Image { public_id: string;}

  console.debug("[deleteSubCategoryLogic] id:", id);

  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) return { success: false, message: "Sub Category not found!" };

  if (subCategory.images?.length) {
  await Promise.all(
    subCategory.images.map((img: Image) => cloudinary.uploader.destroy(img.public_id))
  );
}

  const subCategories = await SubCategory.find().sort({ updatedAt: -1 });
  return {
    success: true,
    message: "Sub Category successfully deleted.",
    subCategories: JSON.parse(JSON.stringify(subCategories)),
  };
};



/*======================================================================================
 * UPDATE SUBCATEGORY (Logic)
 *======================================================================================*/


const updateSubCategoryLogic = async (id: string, name: string, parent: string | null) => {
  console.debug("[updateSubCategoryLogic] id/name/parent:", { id, name, parent });

  const updatedParent: mongoose.Types.ObjectId | null =
    parent && mongoose.Types.ObjectId.isValid(parent) ? new mongoose.Types.ObjectId(parent) : null;

  await SubCategory.findByIdAndUpdate(id, { name, parent: updatedParent });

  const subCategories = await SubCategory.find().sort({ updatedAt: -1 });
  return {
    success: true,
    message: "Sub Category successfully updated.",
    subCategories: JSON.parse(JSON.stringify(subCategories)),
  };
};


/*======================================================================================
 * GET SUBCATEGORIES BY CATEGORY PARENT (Logic)
 *======================================================================================*/


const getSubCategoriesByCategoryParentLogic = async (category: string) => {
  if (!category) return { success: false, message: "No Category provided.", subCategories: [] };

  const results = await SubCategory.find({ parent: category }).select("name");
  return { success: true, subCategories: JSON.parse(JSON.stringify(results)) };
};


/*======================================================================================
 * Exports
 *======================================================================================*/



export {
  getAllSubCategoriesAndCategoriesLogic,
  getSingleSubCategoryLogic,
  createSubCategoryLogic,
  deleteSubCategoryLogic,
  updateSubCategoryLogic,
  getSubCategoriesByCategoryParentLogic,
};
