/*======================================================================================
 * File: couponLogic.ts
 * Author: [Your Name]
 * Date: [Date]
 *
 * Description:
 * -----------------------------------------------------------------------------
 * Pure business logic for vendor coupon management.
 * - No error handling: errors bubble up to controllers.
 * - Handles DB operations and coupon validations.
 * - Always returns fresh coupon list sorted by `updatedAt`.
======================================================================================*/

"use server";


import Coupon from "@/app/features/coupon/models/couponModel";
import Vendor from "@/app/vendor/core/models/vendorModel";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;



// *======================================================================================
// Create Coupon Logic
// *======================================================================================


const createCouponLogic = async (
    coupon: string, discount: number,
    startDate: any, endDate: any, vendorId: string
) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    console.debug("Invalid vendor ID:", vendorId);
    throw new Error("Vendor Id is invalid!");
  }

  const existingCoupon = await Coupon.findOne({ coupon });
  if (existingCoupon) {
    console.debug("Coupon already exists:", coupon);
    throw new Error("Coupon already exists, try a different coupon name.");
  }

  const newCoupon = new Coupon({ coupon, discount, startDate, endDate, vendor });
  await newCoupon.save();
  console.debug("Created coupon:", newCoupon);

  const vendorCoupons = await Coupon.find({ "vendor._id": vendorId }).sort({ updatedAt: -1 });
  console.debug("All vendor coupons after creation:", vendorCoupons);

  return vendorCoupons;
};


// *======================================================================================
// Delete Coupon Logic
// *======================================================================================


const deleteCouponLogic = async (couponId: string, vendorId: string) => {
  const coupon = await Coupon.findByIdAndDelete(couponId);
  if (!coupon) {
    console.debug("Coupon not found for deletion with ID:", couponId);
    throw new Error("No Coupon found with this Id!");
  }

  const vendor = await Vendor.findById(new ObjectId(vendorId));
  if (!vendor) {
    console.debug("Invalid vendor ID:", vendorId);
    throw new Error("Vendor Id is invalid!");
  }

  const vendorCoupons = await Coupon.find({ "vendor._id": vendorId }).sort({ updatedAt: -1 });
  console.debug("All vendor coupons after deletion:", vendorCoupons);

  return vendorCoupons;
};



// *======================================================================================
// Update Coupon Logic
// *======================================================================================


const updateCouponLogic = async (
    couponId: string, coupon: string,
    discount: number, startDate: any,
    endDate: any, vendorId: string) => {
    
  const updatedCoupon = await Coupon.findByIdAndUpdate(couponId,
    { coupon, discount, startDate, endDate }, { new: true });
  if (!updatedCoupon) {
    console.debug("Coupon not found for update with ID:", couponId);
    throw new Error("No Coupon found with this Id.");
  }

  const vendorCoupons = await Coupon.find({ "vendor._id": vendorId }).sort({ updatedAt: -1 });
  console.debug("All vendor coupons after update:", vendorCoupons);

  return vendorCoupons;
};



// *======================================================================================
// Get All Coupons Logic
// *======================================================================================


const getAllCouponsLogic = async (vendorId: string) => {
  const vendorCoupons = await Coupon.find({ "vendor._id": vendorId }).sort({ updatedAt: -1 }).lean();
  if (!vendorCoupons) {
    console.debug("No coupons found for vendor ID:", vendorId);
    throw new Error("No Vendor or created vendor coupon found with this Id!");
  }

  console.debug("Fetched all vendor coupons:", vendorCoupons);
  return vendorCoupons;
};



//*======================================================================================

export {
  createCouponLogic,
  deleteCouponLogic,
  updateCouponLogic,
  getAllCouponsLogic
};
