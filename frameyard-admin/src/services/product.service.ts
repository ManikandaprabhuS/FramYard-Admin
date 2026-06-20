import api from './api';
import { Product, ProductVariant } from '../types';

export type ProductPayload = {
  name: string;
  description?: string;
  material: string;
  availableColors: string[];
  isActive?: boolean;
};

export type VariantPayload = {
  frameSize: string;
  hasBorder: boolean;
  hasGlass: boolean;
  price: number;
  offerPrice?: number | null;
  stockQuantity: number;
  priceValidUntil?: string | null;
};

const normalizeVariant = (variant: any): ProductVariant => ({
  ...variant,
  price: Number(variant.price),
  offerPrice:
    variant.offerPrice === null || variant.offerPrice === undefined
      ? null
      : Number(variant.offerPrice),
  stockQuantity: Number(variant.stockQuantity),
  createdAt: variant.createdAt ? new Date(variant.createdAt).toISOString() : new Date().toISOString(),
  priceValidUntil: variant.priceValidUntil
    ? new Date(variant.priceValidUntil).toISOString()
    : null,
});

const normalizeProduct = (product: any): Product => ({
  ...product,
  variants: Array.isArray(product.variants)
    ? product.variants.map(normalizeVariant)
    : [],
  images: Array.isArray(product.images)
    ? product.images.map((image: any) => ({
        ...image,
        displayOrder: Number(image.displayOrder),
      }))
    : [],
});

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return (response.data.products || []).map(normalizeProduct);
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return normalizeProduct(response.data.product);
  },

  createProduct: async (
    product: ProductPayload
  ): Promise<Product> => {
    const response = await api.post('/products/addProduct', product);
    return normalizeProduct(response.data.product);
  },

  updateProduct: async (
    id: string,
    product: ProductPayload
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return normalizeProduct(response.data.product);
  },

  createVariant: async (
    productId: string,
    variant: VariantPayload
  ): Promise<ProductVariant> => {
    const response = await api.post(`/products/${productId}/variants`, variant);
    return normalizeVariant(response.data.variant);
  },

  updateVariant: async (
    variantId: string,
    variant: VariantPayload
  ): Promise<ProductVariant> => {
    const response = await api.put(`/products/variants/${variantId}`, variant);
    return normalizeVariant(response.data.variant);
  },

  deleteVariant: async (variantId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/products/variants/${variantId}`);
    return response.data;
  },
};
