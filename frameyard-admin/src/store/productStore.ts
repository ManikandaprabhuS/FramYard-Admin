import { create } from 'zustand';
import { Product } from '../types';
import { productService } from '../services/product.service';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdDate'>) => Promise<boolean>;
  editProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  removeProduct: (id: string) => Promise<boolean>;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productService.getProducts();
      set({ products: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch products', loading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({ currentProduct: product, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch product', loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const newProd = await productService.createProduct(product);
      set((state) => ({
        products: [...state.products, newProd],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to add product', loading: false });
      return false;
    }
  },

  editProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const updatedProd = await productService.updateProduct(id, product);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProd : p)),
        currentProduct: state.currentProduct?.id === id ? updatedProd : state.currentProduct,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update product', loading: false });
      return false;
    }
  },

  removeProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to delete product', loading: false });
      return false;
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
}));
