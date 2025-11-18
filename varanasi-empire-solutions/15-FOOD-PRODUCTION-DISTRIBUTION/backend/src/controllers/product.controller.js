import { productService } from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, message: 'Product created', data: product });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const filters = {
    category: req.query.category,
    status: req.query.status,
    is_perishable: req.query.is_perishable,
    search: req.query.search,
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0,
  };
  const products = await productService.getAllProducts(filters);
  res.json({ success: true, count: products.length, data: products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.id);
  res.json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json({ success: true, message: 'Product updated', data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  res.json({ success: true, data: categories });
});
