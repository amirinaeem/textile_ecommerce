/*======================================================================================
 * File: analyticsLogic.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * *=================================================================================
 * Pure promise-based business logic for vendor-specific analytics.
 * No error handling here — errors bubble up to controllers.
======================================================================================*/

"use server";

import { Document, Model } from "mongoose";
import { verify_vendor } from "@/app/core/utils/verifyVendorUtil";
import Product from "@/app/features/products/models/productModel";
import { getMonthsRanges, MonthData } from "@/app/core/utils/timeManageUtils";


// *======================================================================================
// Orders per Month
// *======================================================================================
const ordersCountPerMonthLgic = async <T extends Document>(model: Model<T>) => {
  const vendor = await verify_vendor();
  if (!vendor?.id) {
    console.debug("Vendor verification failed in ordersCountPerMonthLgic");
    throw new Error("Vendor verification failed");
  }

  const ranges = getMonthsRanges();
  const last12Months: MonthData[] = [];

  for (const { start, end, monthLabel } of ranges) {
    const count = await model.countDocuments({
      createdAt: { $gte: start, $lt: end },
      "products.vendorId": vendor.id,
    });
    last12Months.push({ month: monthLabel, count });
  }

  console.debug("Orders per month analytics:", last12Months);
  return last12Months;
};



// *======================================================================================
// Products per Month
// *======================================================================================
const productsCountPerMonthLgic = async <T extends Document>(model: Model<T>) => {
  const vendor = await verify_vendor();
  if (!vendor?.id) {
    console.debug("Vendor verification failed in productsCountPerMonthLgic");
    throw new Error("Vendor verification failed");
  }

  const ranges = getMonthsRanges();
  const last12Months: MonthData[] = [];

  for (const { start, end, monthLabel } of ranges) {
    const count = await model.countDocuments({
      createdAt: { $gte: start, $lt: end },
      "vendor._id": vendor.id,
    });
    last12Months.push({ month: monthLabel, count });
  }

  console.debug("Products per month analytics:", last12Months);
  return last12Months;
};



// *======================================================================================
// Size Analytics
// *======================================================================================
const getProductSizeLgic = async () => {
  const vendor = await verify_vendor();
  if (!vendor?.id) {
    console.debug("Vendor verification failed in getProductSizeLgic");
    throw new Error("Vendor verification failed");
  }

  const products = await Product.find({ "vendor._id": vendor.id });
  if (!products || products.length === 0) {
    console.debug("No products found for vendor:", vendor.id);
    throw new Error("No products found for vendor");
  }

  const sizeMap = products.reduce((acc: Record<string, number>, product: any) => {
    product.subProducts.forEach((subProduct: any) => {
      subProduct.sizes.forEach((size: any) => {
        acc[size.size] = (acc[size.size] || 0) + size.sold;
      });
    });
    return acc;
  }, {});

  const sizeAnalytics = Object.entries(sizeMap).map(([name, value]) => ({ name, value }));
  console.debug("Product size analytics:", sizeAnalytics);

  return sizeAnalytics;
};



// *======================================================================================
// Top Selling Products
// *======================================================================================
const getTopSellingProductsLgic = async () => {
  const vendor = await verify_vendor();
  if (!vendor?.id) {
    console.debug("Vendor verification failed in getTopSellingProductsLgic");
    throw new Error("Vendor verification failed");
  }

  const products = await Product.find({ "vendor._id": vendor.id })
    .sort({ "subProducts.sold": -1 })
    .limit(5)
    .lean();

  if (!products || products.length === 0) {
    console.debug("No products found for top-selling analytics");
    throw new Error("No products found");
  }

  const topProducts = products.map((prod) => ({
    name: prod.name,
    value: prod.subProducts[0]?.sold || 0,
  }));

  console.debug("Top selling products analytics:", topProducts);
  return topProducts;
};




export {
  ordersCountPerMonthLgic,
  productsCountPerMonthLgic,
  getProductSizeLgic,
  getTopSellingProductsLgic,
};
