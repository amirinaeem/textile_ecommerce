
/*======================================================================================
 * Vendor Orders Logic
 * ===================
 * Pure business logic for vendor orders. No DB connections.
 *
 * Functions:
 * - getAllOrdersLogic: Fetch all orders for a vendor with filters (date range, payment status, payment method)
 * - updateProductOrderStatusLogic: Update a product's order status and adjust inventory if completed
 * - updateOrderToOldLogic: Mark an order as old (isNew = false)
 * - getAllNewOrdersLogic: Fetch all new orders for a vendor
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/





"use server";

import mongoose from "mongoose";
import Order from "@/app/features/order/models/orderModel";
import Product from "@/app/features/products/models/productModel";
import User from "@/app/features/users/models/userModel"; // correctly imported
import { mapPaymentStatus, mapPaymentMethod } from "@/app/core/utils/ordersUtils";
import { getDateRange } from "@/app/core/utils/timeManageUtils";

const { ObjectId } = mongoose.Types;

/*======================================================================================
 * GET ALL ORDERS LOGIC
 *======================================================================================*/


const getAllOrdersLogic = async (
  vendorId: string,
  range: string,
  isPaid: string,
  paymentMethod: string
) => {
  const now = new Date();
  const { fromDate, toDate } = getDateRange(range, now);

  const query: any = {
    products: { $elemMatch: { "vendor._id": vendorId } },
    createdAt: { $gte: fromDate, $lte: toDate },
  };

  const paidStatus = mapPaymentStatus(isPaid);
  if (paidStatus !== undefined) query.isPaid = paidStatus;

  const paymentMethodStatus = mapPaymentMethod(paymentMethod);
  if (paymentMethodStatus) query.paymentMethod = paymentMethodStatus;

  const orders = await Order.find(query)
    .populate({ path: "user", model: User, select: "name email image" })
    .sort({ createdAt: -1 })
    .lean();

  // filter products for this vendor
  return orders.map(order => ({
    ...order,
    products: order.products.filter(
      (p: any) => p.vendor?._id.toString() === vendorId
    ),
  }));
};



/*======================================================================================
 * UPDATE PRODUCT ORDER STATUS LOGIC
 *======================================================================================*/


const updateProductOrderStatusLogic = async (
  orderId: string,
  productId: string,
  status: string
) => {
  const order = await Order.findById(orderId);
  if (!order) return { message: "Order not found", success: false };

  let productUpdated = false;

  order.products = await Promise.all(
    order.products.map(async (product: any) => {
      if (product._id.toString() === productId) {
        product.status = status;
        if (status === "Completed") {
          product.productCompletedAt = new Date();

          const mainProduct = await Product.findById(product.product);
          if (mainProduct) {
            const subProduct = mainProduct.subProducts[0];
            if (subProduct) {
              const size = subProduct.sizes.find((s: any) => s.size === product.size);
              if (size && typeof size.qty === "number" && typeof product.qty === "number") {
                size.qty -= product.qty;
                size.sold += 1;
                subProduct.sold += 1;
                await mainProduct.save();
              }
            }
          }
        }
        productUpdated = true;
      }
      return product;
    })
  );

  if (!productUpdated) return { message: "Product not found in order", success: false };

  await order.save();
  return { message: "Product status updated successfully", success: true };
};



/*======================================================================================
 * UPDATE ORDER TO OLD LOGIC
 *======================================================================================*/


const updateOrderToOldLogic = async (id: string) => {
  await Order.findByIdAndUpdate(id, { isNew: false });
  return { message: "Order marked as old" };
};



/*======================================================================================
 * GET ALL NEW ORDERS LOGIC
 *======================================================================================*/


const getAllNewOrdersLogic = async (vendorId: string) => {
  const vendorObjectId = new ObjectId(vendorId);
  const newOrders = await Order.find({
    products: { $elemMatch: { "vendor._id": vendorObjectId } },
    isNew: true,
  });
  return newOrders;
};



//*======================================================================================
export {
  getAllOrdersLogic,
  updateProductOrderStatusLogic,
  updateOrderToOldLogic,
  getAllNewOrdersLogic,
};
