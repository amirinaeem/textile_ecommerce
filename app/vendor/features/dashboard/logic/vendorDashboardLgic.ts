/*======================================================================================
 * File: vendorDashboardLogic.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -----------------------------------------------------------------------------
 * Pure business logic for vendor dashboard, orders, and product management.
 * - No error handling: errors bubble up to controllers.
 * - Calculates sales, low stock, out-of-stock products.
 * - Returns fresh and fully populated data for controllers.
======================================================================================*/

"use server";
import { getStartOfDay, getEndOfDay, getStartOfWeek, getStartOfMonth } from "@/app/core/utils/timeManageUtils";
import Order from "@/app/features/order/models/orderModel";
import Product from "@/app/features/products/models/productModel";
import User from "@/app/features/users/models/userModel";
import { verify_vendor } from "@/app/core/utils/verifyVendorUtil";

// *======================================================================================*/
// Get Dashboard Data Logic
// *======================================================================================*/


const getDashboardDataLogic = async () => {
  const vendor = await verify_vendor();
  if (!vendor) throw new Error("Vendor not verified");

  const orders = await Order.find({ "products.vendor._id": vendor.id })
    .populate({ path: "user", model: User })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const products = await Product.find({ "vendor._id": vendor.id }).lean();

  return { orders, products };
};


// *======================================================================================*/
// Get Low Stock Products Logic
// *======================================================================================*/


const getLowStockProductsLogic = async () => {
  const vendor = await verify_vendor();
  if (!vendor) throw new Error("Vendor not verified");

  const lowStockProducts = await Product.find(
    {
      "subProducts.sizes.qty": { $lte: 5 },
      "vendor._id": vendor.id,
    },
    {
      name: 1,
      "subProducts.sizes.qty": 1,
      "subProducts.size.size": 1,
      "subProducts._id": 1,
    }
  ).lean();

  return lowStockProducts;
};


// *======================================================================================*/
// Get Out of Stock Products Logic
// *======================================================================================*/


const getOutOfStockProductsLogic = async () => {
  const vendor = await verify_vendor();
  if (!vendor) throw new Error("Vendor not verified");

  const outOfStockProducts = await Product.find(
    {
      "subProducts.sizes.qty": 0,
      "vendor._id": vendor.id,
    },
    {
      name: 1,
      "subProducts.sizes.qty": 1,
      "subProducts.size.size": 1,
      "subProducts._id": 1,
    }
  ).lean();

  return outOfStockProducts;
};


// *======================================================================================*/
// Calculate Total Orders Logic
// *======================================================================================*/


const calculateTotalOrdersLogic = async () => {
  const vendor = await verify_vendor();
  if (!vendor) throw new Error("Vendor not verified");

  const orders = await Order.find({ "products.vendor._id": vendor.id }).lean();
  const now = new Date();

  const startOfDay = getStartOfDay(new Date(now));
  const endOfDay = getEndOfDay(new Date(now));
  const startOfWeek = getStartOfWeek(new Date(now));
  const startOfMonth = getStartOfMonth(new Date(now));

  let totalSales = 0, todaySales = 0, lastWeekSales = 0, lastMonthSales = 0;

  orders.forEach(order => {
    totalSales += order.total;
    const createdAt = new Date(order.createdAt);
    if (createdAt >= startOfDay && createdAt <= endOfDay) todaySales += order.total;
    if (createdAt >= startOfWeek) lastWeekSales += order.total;
    if (createdAt >= startOfMonth) lastMonthSales += order.total;
  });

  const growthPercentage = totalSales - todaySales > 0
    ? (todaySales / (totalSales - todaySales)) * 100
    : 0;

  return {
    todaySales,
    totalSales,
    lastWeekSales,
    lastMonthSales,
    growthPercentage: growthPercentage.toFixed(2)
  };
};

// *======================================================================================*/
// Order Summary Logic
// *======================================================================================*/


const orderSummaryLogic = async () => {
  const vendor = await verify_vendor();
  if (!vendor) throw new Error("Vendor not verified");

  const newOrders = await Order.countDocuments({ isNew: true, "products.vendor._id": vendor.id });
  const pendingOrders = await Order.countDocuments(
    { "products.status": "Not Processed", "products.vendor._id": vendor.id });
  const completedOrders = await Order.countDocuments(
    { "products.status": "Completed", "products.vendor._id": vendor.id });
  const cancelledOrders = await Order.countDocuments(
    { "products.status": "Cancelled", "products.vendor._id": vendor.id });

  return { newOrders, pendingOrders, completedOrders, cancelledOrders };
};



//*======================================================================================


export {
  getDashboardDataLogic,
  getLowStockProductsLogic,
  getOutOfStockProductsLogic,
  calculateTotalOrdersLogic,
  orderSummaryLogic,
};

