/*======================================================================================
 * File: analytics.Cntlr.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * ---------------------------------------------------------------------------
 * Controllers for vendor-specific analytics.
 * Ensures a single DB connection and delegates pure business logic to analyticsLogic.
 * Handles all errors so logic layer remains clean.
======================================================================================*/

"use server";

import Order from "@/app/features/order/models/orderModel";
import Product from "@/app/features/products/models/productModel";
import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import {
  ordersCountPerMonthLgic,
  productsCountPerMonthLgic,
  getProductSizeLgic,
  getTopSellingProductsLgic,
} from "@/app/features/vendor/analytics/logic/vendorAnalyticsLogic";



// *======================================================================================
// Orders per Month
// *======================================================================================


const ordersCountPerMonthCntlr = async () => {
  try {
    await connectToDatabase();
    const data = await ordersCountPerMonthLgic(Order);
    return { success: true, message: "Orders per month retrieved", analytics: data };
  } catch (error) {
    console.error("Error in ordersCountPerMonthCntlr:", error);
    return { success: false, message: "Failed to retrieve order analytics", error };
  }
};



// *======================================================================================
// Products per Month
// *======================================================================================


const productsCountPerMonthCntlr = async () => {
  try {
    await connectToDatabase();
    const data = await productsCountPerMonthLgic(Product);
    return { success: true, message: "Products per month retrieved", analytics: data };
  } catch (error) {
    console.error("Error in productsCountPerMonthCntlr:", error);
    return { success: false, message: "Failed to retrieve product analytics", error };
  }
};



// *======================================================================================
// Size Analytics
// *======================================================================================


const getProductSizeCntlr = async () => {
  try {
    await connectToDatabase();
    const data = await getProductSizeLgic();
    return { success: true, message: "Product size analytics retrieved", analytics: data };
  } catch (error) {
    console.error("Error in getProductSizeCntlr:", error);
    return { success: false, message: "Failed to retrieve size analytics", error };
  }
};


// *======================================================================================
// Top Selling Products
// *======================================================================================


const getTopSellingProductsCntlr = async () => {
  try {
    await connectToDatabase();
    const data = await getTopSellingProductsLgic();
    return { success: true, message: "Top-selling products retrieved", analytics: data };
  } catch (error) {
    console.error("Error in getTopSellingProductsCntlr:", error);
    return { success: false, message: "Failed to retrieve top-selling products", error };
  }
};


//*======================================================================================

export {
  ordersCountPerMonthCntlr,
  productsCountPerMonthCntlr,
  getProductSizeCntlr,
  getTopSellingProductsCntlr,
};
