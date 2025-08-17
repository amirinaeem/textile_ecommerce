/*======================================================================================
 * Vendor Logic
 * =======================
 * Pure business logic (no DB connection). Handles:
 * - Validation & normalization
 * - Queries & mutations with models
 * - Debug logs for flow
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/


"use server";

import mongoose from "mongoose";
import Vendor from "@/app/vendor/core/models/vendorModel";
import { verify_vendor } from "@/app/core/utils/verifyVendorUtil";



/*======================================================================================
 * GET SINGLE VENDOR LOGIC
 *======================================================================================*/

const getSingleVendorLogic = async (vendorId: string) => {
  console.debug("[getSingleVendorLogic] vendorId:", vendorId);

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return { success: false, message: "Invalid Vendor ID." };
  }

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) return { success: false, message: "Vendor not found." };

  return {
    success: true,
    message: "Vendor successfully found.",
    vendor: JSON.parse(JSON.stringify(vendor)),
  };
};

/*======================================================================================
 * CHECK VENDOR EXISTS LOGIC
 *======================================================================================*/


const checkVendorLogic = async (vendorId: string) => {
  console.debug("[checkVendorLogic] vendorId:", vendorId);

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) return { success: false, message: "Vendor not found." };

  return { success: true, message: "Vendor exists." };
};


/*======================================================================================
 * CHECK VENDOR VERIFIED LOGIC
 *======================================================================================*/


const checkVendorVerifiedLogic = async (vendorId: string) => {
  console.debug("[checkVendorVerifiedLogic] vendorId:", vendorId);

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) return { success: false, message: "Vendor not found." };

  return vendor.verified
    ? { success: true, message: "Vendor is verified." }
    : { success: false, message: "Vendor is not verified." };
};


/*======================================================================================
 * GET CURRENT VENDOR LOGIC (from JWT)
 *======================================================================================*/


const getCurrentVendorLogic = async () => {
  try {
    const verified = await verify_vendor();
    if (!verified) return { success: false, message: "Vendor not verified or token missing." };

    const vendorId = verified.id.toString();
    const result = await getSingleVendorLogic(vendorId);
    return result;
  } catch (error: any) {
    console.error("[getCurrentVendorLogic] Error:", error);
    return { success: false, message: "Failed to fetch current vendor." };
  }
};




// *======================================================================================*/


export {

    getSingleVendorLogic,
    checkVendorLogic,
    checkVendorVerifiedLogic,
    getCurrentVendorLogic
}




