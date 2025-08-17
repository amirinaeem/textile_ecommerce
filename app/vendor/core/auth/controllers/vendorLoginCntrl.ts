
/*============================================================================
 * File: vendorAuthCntlr.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * ------------------------------------------------------------------------
 * Controller for vendor authentication. Uses async/await with try/catch to handle
 * errors. Delegates the actual login logic to the `loginVendorLogic` function.
 *
 * Exports:
 * 1. loginVendorCntlr - Handles vendor login requests and error handling.
==============================================================================*/


"use server";

import { loginVendorLgic } from "@/app/vendor/core/auth/logic/vendorLoginLgic";

export const loginVendorCntlr = async (email: string, password: string) => {
  try {
    return await loginVendorLgic(email, password);
  } catch (error) {
    console.error("Error in loginVendorCntlr:", error);
    return {
      message: "Login failed due to a server error.",
      success: false,
    };
  }
};
