/*======================================================================================
 * Vendor Products Controllers
 * ===========================
 * Responsibilities:
 * - Connect to DB
 * - Input normalization
 * - Call business logic
 * - Consistent responses & error handling
 * - Cloudinary configuration (one-time, side-effecty)
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/

"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import cloudinary from "cloudinary";
import {
  createProductLogic,
  deleteProductLogic,
  updateProductLogic,
  getSingleProductByIdLogic,
  getVendorProductsLogic,
  getEntireProductByIdLogic,
  getParentsAndCategoriesLogic,
} from "@/app/vendor/features/products/logic/vendorProductsLgic";

import {
  CreateProductInput,
  UpdateProductInput,
} from "@/app/vendor/core/utils/vendorutils";



/*======================================================================================
 * CREATE PRODUCT (Controller)
 *======================================================================================*/

const createProductCntlr = async (payload: CreateProductInput) => {
  try {
    await connectToDatabase();
    const result = await createProductLogic(payload);
    return result;
  } catch (error: any) {
    console.error("Error in createProductCntlr:", { error, payloadSummary: { vendorId: payload.vendorId, name: payload.name, parent: payload.parent }});
    return { success: false, message: "Failed to create product." };
  }
};


/*======================================================================================
 * DELETE PRODUCT (Controller)
 *======================================================================================*/


const deleteProductCntlr = async (productId: string) => {
  try {
    await connectToDatabase();
    const result = await deleteProductLogic(productId);
    return result;
  } catch (error: any) {
    console.error("Error in deleteProductCntlr:", { error, productId });
    return { success: false, message: "Failed to delete product." };
  }
};


/*======================================================================================
 * UPDATE PRODUCT (Controller)
 *======================================================================================*/


const updateProductCntlr = async (payload: UpdateProductInput) => {
  try {
    await connectToDatabase();
    const result = await updateProductLogic(payload);
    return result;
  } catch (error: any) {
    console.error("Error in updateProductCntlr:", { error, productId: payload.productId, vendorId: payload.vendorId });
    return { success: false, message: "Failed to update product." };
  }
};


/*======================================================================================
 * GET SINGLE PRODUCT BY ID (Controller)
 *======================================================================================*/


const getSingleProductByIdCntlr = async (id: string, style?: number, sizeIndex?: number) => {
  try {
    await connectToDatabase();
    const result = await getSingleProductByIdLogic(id, style, sizeIndex);
    return result;
  } catch (error: any) {
    console.error("Error in getSingleProductByIdCntlr:", { error, id, style, sizeIndex });
    return { success: false, message: "Failed to fetch product." };
  }
};


/*======================================================================================
 * GET VENDOR PRODUCTS (Controller)
 *======================================================================================*/


const getVendorProductsCntlr = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const result = await getVendorProductsLogic(vendorId);
    return result;
  } catch (error: any) {
    console.error("Error in getVendorProductsCntlr:", { error, vendorId });
    return { success: false, message: "Failed to fetch vendor products." };
  }
};


/*======================================================================================
 * GET ENTIRE PRODUCT BY ID (Controller)
 *======================================================================================*/


const getEntireProductByIdCntlr = async (id: string) => {
  try {
    await connectToDatabase();
    const result = await getEntireProductByIdLogic(id);
    return result;
  } catch (error: any) {
    console.error("Error in getEntireProductByIdCntlr:", { error, id });
    return { success: false, message: "Failed to fetch product." };
  }
};


/*======================================================================================
 * GET PARENTS & CATEGORIES (Controller)
 *======================================================================================*/


const getParentsAndCategoriesCntlr = async () => {
  try {
    await connectToDatabase();
    const result = await getParentsAndCategoriesLogic();
    return result;
  } catch (error: any) {
    console.error("Error in getParentsAndCategoriesCntlr:", { error });
    return { success: false, message: "Failed to fetch parents and categories." };
  }
};


/*======================================================================================
 * Exports
 *======================================================================================*/


export {
  createProductCntlr,
  deleteProductCntlr,
  updateProductCntlr,
  getSingleProductByIdCntlr,
  getVendorProductsCntlr,
  getEntireProductByIdCntlr,
  getParentsAndCategoriesCntlr,
};
