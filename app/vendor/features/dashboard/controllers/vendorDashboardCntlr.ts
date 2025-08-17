
/*======================================================================================
 * Vendor Dashboard Controllers
 * ===========================
 * This module contains server-side functions for fetching vendor dashboard data,
 * low stock products, out of stock products, total orders, and order summary.
 * 
 * Each function:
 *  - Connects to the MongoDB database
 *  - Calls the corresponding logic function
 *  - Returns structured responses with success flags and debug-friendly messages
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/

"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import {
  getDashboardDataLogic,
  getLowStockProductsLogic,
  getOutOfStockProductsLogic,
  calculateTotalOrdersLogic,
  orderSummaryLogic,
} from "@/app/vendor/features/dashboard/logic/vendorDashboardLgic";





//*======================================================================================*/
// GET DASHBOARD DATA CONTROLLER
//*======================================================================================*/


const getDashboardDataCntlr = async () => {
  try {
    await connectToDatabase();
    const data = await getDashboardDataLogic();

    return {
      message: "Successfully fetched dashboard data.",
      success: true,
      orders: JSON.parse(JSON.stringify(data.orders)),
      products: JSON.parse(JSON.stringify(data.products)),
    };
  } catch (error: any) {
    console.error("Error in getDashboardDataCntlr:", error);
    return { message: "Failed to fetch dashboard data.", success: false };
  }
};


// *======================================================================================*/
// GET LOW STOCK PRODUCTS CONTROLLER
// *======================================================================================*/


const getLowStockProductsCntlr = async () => {
  try {
    await connectToDatabase();
    const lowStockProducts = await getLowStockProductsLogic();

    return {
      message: "Successfully fetched low stock products.",
      success: true,
      lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts)),
    };
  } catch (error: any) {
    console.error("Error in getLowStockProductsCntlr:", error);
    return { message: "Failed to fetch low stock products.", success: false };
  }
};


// *======================================================================================*/
// GET OUT OF STOCK PRODUCTS CONTROLLER
// *======================================================================================*/


const getOutOfStockProductsCntlr = async () => {
  try {
    await connectToDatabase();
    const outOfStockProducts = await getOutOfStockProductsLogic();

    return {
      message: "Successfully fetched out of stock products.",
      success: true,
      outOfStockProducts: JSON.parse(JSON.stringify(outOfStockProducts)),
    };
  } catch (error: any) {
    console.error("Error in getOutOfStockProductsCntlr:", error);
    return { message: "Failed to fetch out of stock products.", success: false };
  }
};


// *======================================================================================*/
// CALCULATE TOTAL ORDERS CONTROLLER
// *======================================================================================*/


const calculateTotalOrdersCntlr = async () => {
  try {
    await connectToDatabase();
    const summary = await calculateTotalOrdersLogic();

    return {
      message: "Successfully calculated total orders and sales.",
      success: true,
      ...summary,
    };
  } catch (error: any) {
    console.error("Error in calculateTotalOrdersCntlr:", error);
    return { message: "Failed to calculate total orders.", success: false };
  }
};


// *======================================================================================*/
// ORDER SUMMARY CONTROLLER
// *======================================================================================*/

const orderSummaryCntlr = async () => {
  try {
    await connectToDatabase();
    const summary = await orderSummaryLogic();

    return {
      message: "Successfully fetched order summary.",
      success: true,
      ...summary,
    };
  } catch (error: any) {
    console.error("Error in orderSummaryCntlr:", error);
    return { message: "Failed to fetch order summary.", success: false };
  }
};




//*======================================================================================

export {
  getDashboardDataCntlr,
  getLowStockProductsCntlr,
  getOutOfStockProductsCntlr,
  calculateTotalOrdersCntlr,
  orderSummaryCntlr,
};

