/*======================================================================================
 * Vendor Utilities
 * Centralized types and helpers for vendor-related operations
======================================================================================*/

import { Types } from "mongoose";

/*======================================================================================
 * Types
 *======================================================================================*/

export type SizeInput = {
  size: string;
  qty: string | number;
  price: string | number;
};

export type DetailInput = {
  name: string;
  value: string;
};

export type QAInput = {
  question: string;
  answer: string;
};

export type NamedInput = {
  name: string;
};

// TODO: refine once you finalize product color schema
export type ColorInput = any;

export type CreateProductInput = {
  vendorId: string;
  sku: string;
  color: ColorInput;
  images: string[];
  sizes: SizeInput[];
  discount: number; // percentage (0–100)
  name: string;
  description: string;
  longDescription: string;
  brand: string;
  details: DetailInput[];
  questions: QAInput[];
  category: string;
  subCategories: string[];
  benefits: NamedInput[];
  ingredients: NamedInput[];
  parent?: string;
};

export type UpdateProductInput = {
  productId: string;
  vendorId: string;
  sku: string;
  color: string; // stored under subProducts[0].color.color
  sizes: SizeInput[];
  discount: number;
  name: string;
  description: string;
  brand: string;
  details: DetailInput[];
  questions: QAInput[];
  benefits: NamedInput[];
  ingredients: NamedInput[];
  longDescription: string;
};

/*======================================================================================
 * Helpers
 *======================================================================================*/

/**
 * Safely cast string to ObjectId.
 * Returns `null` if invalid.
 */
const toObjectId = (id: string) => {
  try {
    return new Types.ObjectId(id);
  } catch {
    return null;
  }
};

/**
 * Normalize string|number into a number.
 */
const toNumber = (v: string | number) =>
  typeof v === "number" ? v : Number(v);

/**
 * Compute discounted price given a percentage (0–100).
 */
const computeDiscountedPrice = (priceBefore: number, discountPercent: number) => {
  if (!discountPercent || discountPercent <= 0) return priceBefore;
  return Math.max(0, priceBefore - priceBefore * (discountPercent / 100));
};

/*======================================================================================
 * Exports
 *======================================================================================*/
export {
  toObjectId,
  toNumber,
  computeDiscountedPrice,
};
