/*======================================================================================
 * Vendor Controllers
 * ==================
 * Responsibilities:
 * - Connect to DB
 * - Input normalization
 * - Call business logic
 * - Consistent responses & error handling
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/


"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import {
  getSingleVendorLogic,
  checkVendorLogic,
  checkVendorVerifiedLogic,
  getCurrentVendorLogic,
} from "@/app/vendor/core/logic/vendorLogic";



/*======================================================================================
 * GET SINGLE VENDOR
 *======================================================================================*/


const getSingleVendorCntlr = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const result = await getSingleVendorLogic(vendorId);
    return result;
  } catch (error: any) {
    console.error("Error in getSingleVendorCntlr:", { error, vendorId });
    return { success: false, message: "Failed to fetch vendor." };
  }
};



/*======================================================================================
 * CHECK VENDOR
 *======================================================================================*/


const checkVendorCntlr = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const result = await checkVendorLogic(vendorId);
    return result;
  } catch (error: any) {
    console.error("Error in checkVendorCntlr:", { error, vendorId });
    return { success: false, message: "Failed to check vendor." };
  }
};


/*======================================================================================
 * CHECK VENDOR VERIFIED
 *======================================================================================*/


const checkVendorVerifiedCntlr = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const result = await checkVendorVerifiedLogic(vendorId);
    return result;
  } catch (error: any) {
    console.error("Error in checkVendorVerifiedCntlr:", { error, vendorId });
    return { success: false, message: "Failed to check vendor verification." };
  }
};



/*======================================================================================
 * GET CURRENT VENDOR (from JWT)
 *======================================================================================*/


const getCurrentVendorCntlr = async () => {
  try {
    await connectToDatabase();
    const result = await getCurrentVendorLogic();
    return result;
  } catch (error: any) {
    console.error("Error in getCurrentVendorCntlr:", { error });
    return { success: false, message: "Failed to fetch current vendor." };
  }
};





// *======================================================================================*/


export {
    
    getSingleVendorCntlr,
    checkVendorCntlr,
    checkVendorVerifiedCntlr,
    getCurrentVendorCntlr
}