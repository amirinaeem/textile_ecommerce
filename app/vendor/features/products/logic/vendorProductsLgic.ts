/*======================================================================================
 * Vendor Products Logic
 * =====================
 * Pure business logic (no DB connect). Handles:
 * - Validation & normalization
 * - Queries & mutations with models
 * - Debug logs for flow
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 *======================================================================================*/

"use server";

import cloudinary from '@/app/core/cloudinary/config/cloudinaryCfg';
import { uploadFileToCloudinary } from '@/app/core/cloudinary/service/cloudinaryService';
import slugify from "slugify";
import Category from "@/app/features/category/models/categoryModel";
import Product from "@/app/features/products/models/productModel";
import Vendor from "@/app/vendor/core/models/vendorModel";
import {
  CreateProductInput,
  UpdateProductInput,
  toObjectId,
  toNumber,
  computeDiscountedPrice,
} from "@/app/vendor/core/utils/vendorutils";



/*======================================================================================
 * CREATE PRODUCT (Logic)
 *======================================================================================*/


const createProductLogic = async (input: CreateProductInput) => {
  console.debug("[createProductLogic] input:", { ...input, images: `[${input.images?.length} images]` });

  const vendorObjectId = toObjectId(input.vendorId);
  if (!vendorObjectId) return { success: false, message: "Invalid vendorId." };

  const vendor = await Vendor.findById(vendorObjectId);
  if (!vendor) return { success: false, message: "Vendor not found!" };

  // Normalize sizes
  const normalizedSizes = input.sizes?.map(s => ({
    size: s.size,
    qty: toNumber(s.qty),
    price: toNumber(s.price),
  })) ?? [];

  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(input.images.map(img => uploadFileToCloudinary(img)));
  const imageUrls = uploadedImages.map(img => ({ url: img.secure_url, public_id: img.public_id }));

  if (input.parent) {
    const parent = await Product.findById(input.parent);
    if (!parent) return { success: false, message: "Parent not found!" };

    await parent.updateOne(
      {
        $push: {
          subProducts: {
            sku: input.sku,
            color: input.color,
            images: imageUrls,
            sizes: normalizedSizes,
            discount: input.discount ?? 0,
          },
        },
      },
      { new: true }
    );

    console.debug("[createProductLogic] sub-product added to parent:", input.parent);
    return { success: true, message: "Sub-product added successfully." };
  }

  const slug = slugify(input.name, { lower: true, strict: true });
  const newProduct = new Product({
    name: input.name,
    description: input.description,
    longDescription: input.longDescription,
    brand: input.brand,
    vendor,
    details: input.details ?? [],
    questions: input.questions ?? [],
    slug,
    category: input.category,
    benefits: input.benefits ?? [],
    ingredients: input.ingredients ?? [],
    subCategories: input.subCategories ?? [],
    subProducts: [
      {
        sku: input.sku,
        color: input.color,
        images: imageUrls,
        sizes: normalizedSizes,
        discount: input.discount ?? 0,
      },
    ],
  });

  await newProduct.save();
  console.debug("[createProductLogic] product created:", { _id: newProduct._id, name: input.name });
  return { success: true, message: "Product created successfully." };
};




/*======================================================================================
 * DELETE PRODUCT (Logic)
 *======================================================================================*/


const deleteProductLogic = async (productId: string) => {
  console.debug("[deleteProductLogic] productId:", productId);

  const deleted: any = await Product.findByIdAndDelete(productId);
  if (!deleted) return { success: false, message: "Product not found with this Id!" };

  // Clean up images from Cloudinary
  if (deleted.subProducts) {
    for (const sp of deleted.subProducts) {
      if (sp.images?.length) {
        await Promise.all(
          sp.images.map((img: any) => cloudinary.uploader.destroy(img.public_id))
        );
      }
    }
  }

  console.debug("[deleteProductLogic] deleted product images cleaned from Cloudinary.");
  return { success: true, message: "Product successfully deleted!" };
};



/*======================================================================================
 * UPDATE PRODUCT (Logic)
 *======================================================================================*/


const updateProductLogic = async (input: UpdateProductInput) => {
  console.debug("[updateProductLogic] input:", { productId: input.productId, vendorId: input.vendorId });

  const vendorObjectId = toObjectId(input.vendorId);
  if (!vendorObjectId) return { success: false, message: "Invalid vendorId." };

  const product: any = await Product.findOne({
    _id: input.productId,
    "vendor._id": vendorObjectId,
  });

  if (!product) {
    return {
      success: false,
      message: "Product not found or you don't have permission to edit this product.",
    };
  }

  // Ensure required nested structure
  if (!product.subProducts || !product.subProducts[0]) {
    return { success: false, message: "Product is missing primary sub-product." };
  }
  if (!product.subProducts[0].color) {
    product.subProducts[0].color = {};
  }

  // Normalize sizes
  const normalizedSizes = input.sizes?.map(s => ({
    size: s.size,
    qty: toNumber(s.qty),
    price: toNumber(s.price),
  })) ?? [];

  // Update top-level & sub-product[0] fields
  product.name = input.name;
  product.description = input.description;
  product.longDescription = input.longDescription;
  product.brand = input.brand;
  product.details = input.details ?? [];
  product.questions = input.questions ?? [];
  product.benefits = input.benefits ?? [];
  product.ingredients = input.ingredients ?? [];

  product.subProducts[0].sku = input.sku;
  product.subProducts[0].discount = input.discount ?? 0;
  product.subProducts[0].color.color = input.color;
  product.subProducts[0].sizes = normalizedSizes; // FIX: was product.sizes previously

  await product.save();

  console.debug("[updateProductLogic] product updated:", { _id: product._id });
  return {
    success: true,
    message: "Product updated successfully",
    product: JSON.parse(JSON.stringify(product)),
  };
};



/*======================================================================================
 * GET SINGLE PRODUCT BY ID (Logic)
 *======================================================================================*/


const getSingleProductByIdLogic = async (id: string, style = 0, sizeIndex = 0) => {
  console.debug("[getSingleProductByIdLogic] id/style/size:", { id, style, sizeIndex });

  const product: any = await Product.findById(id).lean();
  if (!product) return { success: false, message: "Product not found." };

  const sp = product.subProducts?.[style];
  if (!sp) return { success: false, message: "Style index out of range." };

  const size = sp.sizes?.[sizeIndex];
  if (!size) return { success: false, message: "Size index out of range." };

  const priceBefore = toNumber(size.price);
  const discount = Number(sp.discount ?? 0);
  const price = computeDiscountedPrice(priceBefore, discount);

  return JSON.parse(
    JSON.stringify({
      success: true,
      _id: product._id.toString(),
      style: Number(style),
      name: product.name,
      discount,
      sizes: sp,
      description: product.description,
      longDescription: product.longDescription,
      slug: product.slug,
      sku: sp.sku,
      brand: product.brand,
      category: product.category,
      subCategories: product.subCategories,
      shipping: product.shipping,
      images: sp.images,
      color: sp.color,
      size: size.size,
      price,
      priceBefore,
      vendor: product.vendor,
      quantity: toNumber(size.qty),
    })
  );
};



/*======================================================================================
 * GET VENDOR PRODUCTS (Logic)
 *======================================================================================*/


const getVendorProductsLogic = async (vendorId: string) => {
  console.debug("[getVendorProductsLogic] vendorId:", vendorId);

  const vendorObjectId = toObjectId(vendorId);
  if (!vendorObjectId) return { success: false, message: "Invalid vendorId." };

  const products = await Product.find({ "vendor._id": vendorObjectId })
    .sort({ updatedAt: -1 }) // FIX: was updateAt
    .populate({ path: "category", model: Category })
    .lean();

  return { success: true, products: JSON.parse(JSON.stringify(products)) };
};



/*======================================================================================
 * GET ENTIRE PRODUCT BY ID (Logic)
 *======================================================================================*/


const getEntireProductByIdLogic = async (id: string) => {
  console.debug("[getEntireProductByIdLogic] id:", id);

  const product = await Product.findById(id);
  if (!product) {
    return {
      success: false,
      message: "Product not found with this Id",
      product: [],
    };
  }

  return {
    success: true,
    message: "Successfully found product",
    product: JSON.parse(JSON.stringify(product)),
  };
};


/*======================================================================================
 * GET PARENTS & CATEGORIES (Logic)
 *======================================================================================*/


const getParentsAndCategoriesLogic = async () => {
  console.debug("[getParentsAndCategoriesLogic]");

  const parents = await Product.find().select("name subProducts").lean();
  const categories = await Category.find().lean();

  return {
    success: true,
    parents: JSON.parse(JSON.stringify(parents)),
    categories: JSON.parse(JSON.stringify(categories)),
  };
};


/*======================================================================================
 * Exports
 *======================================================================================*/


export {
  createProductLogic,
  deleteProductLogic,
  updateProductLogic,
  getSingleProductByIdLogic,
  getVendorProductsLogic,
  getEntireProductByIdLogic,
  getParentsAndCategoriesLogic,
};
