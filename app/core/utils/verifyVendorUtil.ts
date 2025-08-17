
/*======================================================================================
 * File: verifyVendorUtil.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -----------------------------------------------------------------------------
 * This utility file contains server-side helper functions related to vendor
 * verification and data handling in a Next.js + Mongoose application.
 * 
 * 1. verify_vendor
 *    - Verifies the vendor from a JWT stored in cookies.
 *    - Returns the vendor's MongoDB ObjectId if valid, otherwise returns null.
 * 
 * 2. base64ToBuffer
 *    - Converts a base64-encoded string (commonly used for images/files) 
 *      to a Node.js Buffer for storage or processing.
 * 
 * Notes:
 * - Used by analytics and product management logic to ensure secure vendor 
 *   operations and handle binary data.
 ======================================================================================*/





import { getCookie } from "@/app/core/utils/handleCookiesUtils";
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";


//*======================================================================================

export const verify_vendor = async () => {
  try {
    const token = await getCookie("vendor_token");
    if (!token) {
      return null; 
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { ObjectId } = mongoose.Types;
    const vendorObjectId = new ObjectId(decode.id);

    return { id: vendorObjectId };
  } catch (error: any) {
    console.log(error);
    return null;
  }
};



//*======================================================================================

export const base64ToBuffer = (base: any) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String, "base64");
};