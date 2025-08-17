
//*======================================================================================
/**
 * Uploads a base64 file to Cloudinary.
 * Automatically detects type and format from the base64 string if possible.
 * @param base64File - base64 string, optionally including data URI prefix
 * @param fileType - optional, defaults to detected type ("image", "video", "raw")
 * @returns Cloudinary upload result
 */
//*======================================================================================

import cloudinary from "@/app/core/cloudinary/config/cloudinaryCfg";
import { base64ToBuffer } from "@/app/core/utils/base64ToBuffer";

type FileType = "image" | "video" | "raw"; // raw = any file




//======================================================================================

export const uploadFileToCloudinary = async (base64File: string, fileType?: FileType) => {
  try {
    let buffer: Buffer;
    let detectedType: FileType = "raw";
    let detectedFormat: string = "";

    // Check if base64 has data URI prefix
    const dataUriMatch = base64File.match(/^data:(.+);base64,(.*)$/);
    if (dataUriMatch) {
      const mimeType = dataUriMatch[1]; // e.g., "image/png" or "video/mp4"
      const base64Data = dataUriMatch[2];
      buffer = Buffer.from(base64Data, "base64");

      // Detect file type from mime
      if (mimeType.startsWith("image/")) {
        detectedType = "image";
        detectedFormat = mimeType.split("/")[1];
      } else if (mimeType.startsWith("video/")) {
        detectedType = "video";
        detectedFormat = mimeType.split("/")[1];
      } else {
        detectedType = "raw";
        detectedFormat = mimeType.split("/")[1] || "";
      }
    } else {
      // No prefix: treat as raw or default image/jpeg
      buffer = base64ToBuffer(base64File);
      detectedType = fileType || "image";
      detectedFormat = detectedType === "image" ? "jpeg" : "";
    }

    // Build data URI for Cloudinary if needed
    let dataUri = buffer.toString("base64");
    if (detectedType === "image") dataUri = `data:image/${detectedFormat};base64,${dataUri}`;
    else if (detectedType === "video") dataUri = `data:video/${detectedFormat};base64,${dataUri}`;
    else dataUri = `data:application/octet-stream;base64,${dataUri}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: detectedType,
      upload_preset: "website",
    });

    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
