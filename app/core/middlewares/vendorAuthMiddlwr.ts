
/*======================================================================================
 * File: vendorAuthMiddleware.ts
 * Location: app/core/middleware
 * Author: [Your Name]
 * Date: [YYYY-MM-DD]
 * 
 * Description:
 * -------------------------------------------------------------------------------------
 * This middleware handles vendor authentication and route protection for the application.
 * It ensures:
 * - Unauthorized vendors cannot access protected /vendor routes.
 * - Logged-in vendors are redirected from signin/signup pages.
 * 
 * Responsibilities:
 * - Verify vendor JWT from cookies using `verify_vendor` utility.
 * - Return appropriate JSON responses for unauthorized access.
 * - Restrict middleware execution to relevant vendor/auth routes.
 * 
 * Usage:
 * - Apply middleware to routes via Next.js `matcher` configuration.
 *======================================================================================*/




import { NextResponse, NextRequest } from "next/server";
import { verify_vendor } from "@/app/core/utils/verifyVendorUtil"; 

export async function vendorAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (
    pathname.startsWith("/vendor") ||
    pathname === "/signin" ||
    pathname === "/signup"
  ) {
    const vendor = await verify_vendor(); 

    
    if (pathname.startsWith("/vendor") && !vendor) {
      return NextResponse.json(
        { message: "Please login to continue" },
        { status: 401 }
      );
    }

    
    if ((pathname === "/signin" || pathname === "/signup") && vendor) {
      return NextResponse.json(
        { message: "You're already logged in, just go to dashboard." },
        { status: 401 }
      );
    }
  }
}



export const config = {
  matcher: ["/vendor/:path*", "/signin", "/signup"],
};


