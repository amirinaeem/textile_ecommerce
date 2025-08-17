
/*======================================================================================
 * File: dbConnectionService.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -----------------------------------------------------------------------------
 * MongoDB connection handler using Mongoose with connection caching.
 * 
 * Features:
 *   - Uses a global cache (`mongooseCache`) to persist the connection across hot reloads
 *     in development and serverless environments.
 *   - Prevents creating multiple database connections on repeated function calls.
 *   - Automatically attaches event listeners for `connected`, `error`, and `disconnected`
 *     states to aid in debugging and monitoring.
 *   - Falls back and retries if a connection error occurs.
 * 
 * Usage:
 *   import { connectToDatabase } from "@/app/core/db/service/dbConnectionService";
 *   const db = await connectToDatabase("my_database_name");
 * 
 * Environment Variables:
 *   - MONGODB_URL: Full MongoDB connection string (required).
======================================================================================*/




import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}


declare global {
  var mongooseCache: MongooseConnection | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}


//======================================================================================

export const connectToDB = async (dbName = "textiles_ecommerce"): Promise<Mongoose> => {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URL environment variable");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        dbName,
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");

        // Attach event listeners for connection
        mongoose.connection.on("connected", () => {
          console.log("Mongoose default connection is open");
        });

        mongoose.connection.on("error", (err) => {
          console.error("Mongoose default connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
          console.warn("Mongoose default connection disconnected");
        });

        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        cached.promise = null; // Reset promise to allow retry
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
