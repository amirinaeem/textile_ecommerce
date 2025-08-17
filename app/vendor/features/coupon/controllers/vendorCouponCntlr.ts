/*======================================================================================
 * File: couponCtrl.ts
 * Author: [Your Name]
 * Date: [Date]
 *
 * Description:
 * -----------------------------------------------------------------------------
 * Controllers for managing vendor coupons.
 * - Ensures a single DB connection before calling business logic.
 * - Delegates pure operations to `couponLogic`.
 * - Handles errors so the logic layer remains clean.
 * - Returns structured responses with { success, message, coupons }.
======================================================================================*/

"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import {
  createCouponLogic,
  deleteCouponLogic,
  updateCouponLogic,
  getAllCouponsLogic,
} from "@/app/vendor/features/coupon/logic/vendorCouponLogic";



// *======================================================================================
// Create Coupon Controller
// *======================================================================================


const createCouponCtrl = async (
  coupon: string, discount: number,
  startDate: any, endDate: any, vendorId: string) => {
  try {
    await connectToDatabase();
    const data = await createCouponLogic(coupon, discount, startDate, endDate, vendorId);
    return { success: true, message: `Coupon ${coupon} created`, coupons: data };
  } catch (error: any) {
    console.debug("Error creating coupon:", error);
    return { success: false, message: "Failed to create coupon", error };
  }
};

// *======================================================================================
// Delete Coupon Controller
// *======================================================================================


const deleteCouponCtrl = async (couponId: string, vendorId: string) => {
  try {
    await connectToDatabase();
    const data = await deleteCouponLogic(couponId, vendorId);
    return { success: true, message: "Coupon deleted", coupons: data };
  } catch (error: any) {
    console.debug("Error deleting coupon:", error);
    return { success: false, message: "Failed to delete coupon", error };
  }
};


// *======================================================================================
// Update Coupon Controller
// *======================================================================================


const updateCouponCtrl = async (
  couponId: string, coupon: string,
  discount: number, startDate: any,
  endDate: any, vendorId: string) => {
  try {
    await connectToDatabase();
    const data = await updateCouponLogic(couponId, coupon, discount, startDate, endDate, vendorId);
    return { success: true, message: "Coupon updated", coupons: data };
  } catch (error: any) {
    console.debug("Error updating coupon:", error);
    return { success: false, message: "Failed to update coupon", error };
  }
};

// *======================================================================================
// Get All Coupons Controller
// *======================================================================================


const getAllCouponsCtrl = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const data = await getAllCouponsLogic(vendorId);
    return { success: true, message: "Fetched vendor coupons", coupons: data };
  } catch (error: any) {
    console.debug("Error fetching coupons:", error);
    return { success: false, message: "Failed to fetch coupons", error };
  }
};


//*======================================================================================

export {
  createCouponCtrl,
  deleteCouponCtrl,
  updateCouponCtrl,
  getAllCouponsCtrl
};
