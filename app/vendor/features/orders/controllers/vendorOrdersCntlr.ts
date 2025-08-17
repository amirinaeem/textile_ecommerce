/*======================================================================================
 * Vendor Orders Controllers
 * =========================
 * This module contains server-side controllers for managing vendor orders:
 * - Fetching all orders with filters
 * - Updating product order status
 * - Marking orders as old
 * - Fetching new orders
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/




"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import {
  getAllOrdersLogic,
  updateProductOrderStatusLogic,
  updateOrderToOldLogic,
  getAllNewOrdersLogic,
} from "@/app/vendor/features/orders/logic/vendorOrdersLogic";




//*======================================================================================*/
// GET ALL ORDERS CONTROLLER
//*======================================================================================*/


const getAllOrdersCntlr = async (
  vendorId: string,
  range: string,
  isPaid: string,
  paymentMethod: string
) => {
  try {
    await connectToDatabase();
    const orders = await getAllOrdersLogic(vendorId, range, isPaid, paymentMethod);

    return {
      message: "Successfully fetched orders.",
      success: true,
      orders,
    };
  } catch (error: any) {
    console.error("Error in getAllOrdersCntlr:", error);
    return { message: "Failed to fetch orders.", success: false };
  }
};



//*======================================================================================*/
// UPDATE PRODUCT ORDER STATUS CONTROLLER
//*======================================================================================*/


const updateProductOrderStatusCntlr = async (
  orderId: string,
  productId: string,
  status: string
) => {
  try {
    await connectToDatabase();
    const response = await updateProductOrderStatusLogic(orderId, productId, status);
    return response;
  } catch (error: any) {
    console.error("Error in updateProductOrderStatusCntlr:", error);
    return { message: "Failed to update product order status.", success: false };
  }
};



//*======================================================================================*/
// UPDATE ORDER TO OLD CONTROLLER
//*======================================================================================*/


const updateOrderToOldCntlr = async (id: string) => {
  try {
    await connectToDatabase();
    const response = await updateOrderToOldLogic(id);
    return response;
  } catch (error: any) {
    console.error("Error in updateOrderToOldCntlr:", error);
    return { message: "Failed to update order to old.", success: false };
  }
};



//*======================================================================================*/
// GET ALL NEW ORDERS CONTROLLER
//*======================================================================================*/


const getAllNewOrdersCntlr = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const newOrders = await getAllNewOrdersLogic(vendorId);
    return {
      message: "Successfully fetched new orders.",
      success: true,
      newOrders,
    };
  } catch (error: any) {
    console.error("Error in getAllNewOrdersCntlr:", error);
    return { message: "Failed to fetch new orders.", success: false };
  }
};





//*======================================================================================

export {
  getAllOrdersCntlr,
  updateProductOrderStatusCntlr,
  updateOrderToOldCntlr,
  getAllNewOrdersCntlr,
};
