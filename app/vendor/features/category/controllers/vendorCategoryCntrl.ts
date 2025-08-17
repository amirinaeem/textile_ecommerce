/*======================================================================================
 * File: category.Ctrl.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -----------------------------------------------------------------------------
 * Controllers for managing vendor categories.
 * - Ensures a single DB connection before calling business logic.
 * - Delegates pure operations to `categoryLogic`.
 * - Handles errors so the logic layer remains clean.
 * - Returns structured responses with { success, message, categories }.
======================================================================================*/

"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import {
  createCategoryLogic,
  deleteCategoryLogic,
  updateCategoryLogic,
  getAllCategoriesLogic,
} from "@/app/features/vendor/category/logic/vendorCategoryLgic";



// *======================================================================================
// Create Category
// *======================================================================================


const createCategoryCtrl = async (name: string, images: string[]) => {
  try {
    await connectToDatabase();
    const data = await createCategoryLogic(name, images);
    return { success: true, message: `Category ${name} created`, categories: data };
  } catch (error) {
    return { success: false, message: "Failed to create category", error };
  }
};



// *======================================================================================
// Delete Category
// *======================================================================================


const deleteCategoryCtrl = async (id: string) => {
  try {
    await connectToDatabase();
    const data = await deleteCategoryLogic(id);
    return { success: true, message: "Category deleted", categories: data };
  } catch (error) {
    return { success: false, message: "Failed to delete category", error };
  }
};


// *======================================================================================
// Update Category
// *======================================================================================


const updateCategoryCtrl = async (id: string, name: string) => {
  try {
    await connectToDatabase();
    const data = await updateCategoryLogic(id, name);
    return { success: true, message: "Category updated", categories: data };
  } catch (error) {
    return { success: false, message: "Failed to update category", error };
  }
};



// *======================================================================================
// Get All Categories
// *======================================================================================


const getAllCategoriesCtrl = async () => {
  try {
    await connectToDatabase();
    const data = await getAllCategoriesLogic();
    return { success: true, categories: data };
  } catch (error) {
    return { success: false, message: "Failed to fetch categories", error };
  }
};



//*======================================================================================


export {
  createCategoryCtrl,
  deleteCategoryCtrl,
  updateCategoryCtrl,
  getAllCategoriesCtrl,
};
