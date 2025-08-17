/*======================================================================================
 * Vendor SubCategory Controllers
 * ==============================
 * Responsibilities:
 * - Connect to DB
 * - Input normalization
 * - Call business logic
 * - Consistent responses & error handling
 * - Cloudinary configuration (one-time)
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/
"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import {
  getAllSubCategoriesAndCategoriesLogic,
  getSingleSubCategoryLogic,
  createSubCategoryLogic,
  deleteSubCategoryLogic,
  updateSubCategoryLogic,
  getSubCategoriesByCategoryParentLogic,
} from "@/app/vendor/features/subCategories/logic/vendorSubCategoryLgic";




/*======================================================================================
 * GET ALL SUBCATEGORIES & CATEGORIES
 *======================================================================================*/


const getAllSubCategoriesAndCategoriesCntlr = async () => {
  try {
    await connectToDatabase();
    const result = await getAllSubCategoriesAndCategoriesLogic();
    return result;
  } catch (error: any) {
    console.error("Error in getAllSubCategoriesAndCategoriesCntlr:", { error });
    return { success: false, message: "Failed to fetch categories and subcategories." };
  }
};


/*======================================================================================
 * GET SINGLE SUBCATEGORY
 *======================================================================================*/


const getSingleSubCategoryCntlr = async (categoryId?: string) => {
  try {
    await connectToDatabase();
    const result = await getSingleSubCategoryLogic(categoryId);
    return result;
  } catch (error: any) {
    console.error("Error in getSingleSubCategoryCntlr:", { error, categoryId });
    return { success: false, message: "Failed to fetch subcategory." };
  }
};


/*======================================================================================
 * CREATE SUBCATEGORY
 *======================================================================================*/


const createSubCategoryCntlr = async (
  name: string,
  parent: string,
  images: any[]
) => {
  try {
    await connectToDatabase();
    const result = await createSubCategoryLogic(name, parent, images);
    return result;
  } catch (error: any) {
    console.error("Error in createSubCategoryCntlr:", { error, name, parent });
    return { success: false, message: "Failed to create subcategory." };
  }
};



/*======================================================================================
 * DELETE SUBCATEGORY
 *======================================================================================*/


const deleteSubCategoryCntlr = async (id: string) => {
  try {
    await connectToDatabase();
    const result = await deleteSubCategoryLogic(id);
    return result;
  } catch (error: any) {
    console.error("Error in deleteSubCategoryCntlr:", { error, id });
    return { success: false, message: "Failed to delete subcategory." };
  }
};



/*======================================================================================
 * UPDATE SUBCATEGORY
 *======================================================================================*/


const updateSubCategoryCntlr = async (
  id: string,
  name: string,
  parent: string | null
) => {
  try {
    await connectToDatabase();
    const result = await updateSubCategoryLogic(id, name, parent);
    return result;
  } catch (error: any) {
    console.error("Error in updateSubCategoryCntlr:", { error, id, name, parent });
    return { success: false, message: "Failed to update subcategory." };
  }
};


/*======================================================================================
 * GET SUBCATEGORIES BY CATEGORY PARENT
 *======================================================================================*/


const getSubCategoriesByCategoryParentCntlr = async (categoryId: string) => {
  try {
    await connectToDatabase();
    const result = await getSubCategoriesByCategoryParentLogic(categoryId);
    return result;
  } catch (error: any) {
    console.error("Error in getSubCategoriesByCategoryParentCntlr:", { error, categoryId });
    return { success: false, message: "Failed to fetch subcategories by category." };
  }
};


/*======================================================================================
 * Exports
 *======================================================================================*/


export {
  getAllSubCategoriesAndCategoriesCntlr,
  getSingleSubCategoryCntlr,
  createSubCategoryCntlr,
  deleteSubCategoryCntlr,
  updateSubCategoryCntlr,
  getSubCategoriesByCategoryParentCntlr,
};
