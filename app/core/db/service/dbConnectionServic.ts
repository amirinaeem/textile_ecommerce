
"use server";

/*======================================================================================
 * File: dbConnectionServic.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -----------------------------------------------------------------------------
 * Service wrapper for initializing a MongoDB connection.
 * 
 * Features:
 *   - Provides a single entry point (`connectToDatabase`) for controllers and logic layers.
 *   - Ensures the connection is established before executing any DB operations.
 *   - Relies on the centralized `connectToDatabase` utility for connection handling.
 *   - Adds error logging and rethrows errors for higher-level handling.
 * 
 * Usage:
 *   import { connectToDatabase } from "@/app/core/db/service/dbConnectionServic";
 *   await connectToDatabase();
======================================================================================*/





import { connectToDB } from "@/app/core/db/config/dpCfg";

// ---------------------------
// Connect to database once
// ---------------------------
export const connectToDatabase = async () => {
  try {
    await connectToDB();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed.");
  }
};