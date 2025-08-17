
/*===============================================================================
 * File: vendorAuthLogic.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * ------------------------------------------------------------------------------
 * Logic layer for vendor authentication. Connects to the database, validates input,
 * checks vendor credentials, generates JWT token, and sets authentication cookies.
 *
 * Exports:
 * 1. loginVendorLogic - Pure function that performs vendor login and returns result.
==============================================================================*/



"use server";

import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
import Vendor from "@/app/vendor/core/models/vendorModel";
import { setCookie } from "@/app/core/utils/handleCookiesUtils";

export const loginVendorLgic = async (email: string, password: string) => {
  await connectToDatabase();

  if (!email || !password) {
    return {
      message: "Please fill in all fields",
      success: false,
    };
  }

  const vendor = await Vendor.findOne({ email }).select("+password");
  if (!vendor) {
    return {
      message: "Vendor doesn't exist.",
      success: false,
    };
  }

  const isPasswordValid = await vendor.comparePassword(password);
  if (!isPasswordValid) {
    return {
      message: "Password is incorrect.",
      success: false,
    };
  }

  const token = vendor.getJWTToken();
  await setCookie({ name: "vendor_token", value: token });

  return {
    message: "Login Successful.",
    vendor: JSON.parse(JSON.stringify(vendor)),
    token,
    success: true,
  };
};
