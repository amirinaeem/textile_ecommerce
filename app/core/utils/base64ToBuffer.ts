

/*======================================================================================
 * File: base64ToBuffer.ts
 * Author: [Your Name]
 * Date: [Date]
 * 
 * Description:
 * -----------------------------------------------------------------------------
 * Utility function to convert a Base64-encoded string into a Node.js Buffer.
 * 
 * Usage:
 *   - Accepts a base64 string (e.g., "data:image/png;base64,....").
 *   - Removes the prefix (if present) and decodes the content.
 *   - Returns a Buffer object that can be used for file operations, uploads, etc.
======================================================================================*/



export const base64ToBuffer = (base: any) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String, "base64");
};