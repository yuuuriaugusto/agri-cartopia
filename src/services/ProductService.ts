
import { toast } from "sonner";
import { Product } from "@/context/ProductContext";

export interface CreateProductData {
  name: string;
  category: string;
  subcategory: string;
  price: number;
  images: string[];
  description: string;
  features: string[];
  specs: { [key: string]: string };
  stock: number;
  brand: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

// This is a frontend service that would connect to the backend API
class ProductService {
  // Create a new product
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      // In a real implementation, this would be an API call
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        rating: 0, // New products start with no rating
        reviews: 0, // New products start with no reviews
        ...productData
      };
      
      toast.success("Product created successfully!");
      return newProduct;
    } catch (error) {
      toast.error("Failed to create product");
      throw error;
    }
  }

  // Get a product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      // In a real implementation, this would be an API call
      // For now we're using the context directly
      const product = window.__PRODUCT_CONTEXT__?.getProductById(id);
      return product || null;
    } catch (error) {
      toast.error("Failed to fetch product");
      throw error;
    }
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      // In a real implementation, this would be an API call
      // For now we're using the context directly
      return window.__PRODUCT_CONTEXT__?.products || [];
    } catch (error) {
      toast.error("Failed to fetch products");
      throw error;
    }
  }

  // Update a product
  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      // In a real implementation, this would be an API call
      // For now we're using the context directly
      const updated = window.__PRODUCT_CONTEXT__?.updateProduct(id, updates) || false;
      
      if (updated) {
        toast.success("Product updated successfully!");
      } else {
        toast.error("Product not found");
      }
      
      return updated;
    } catch (error) {
      toast.error("Failed to update product");
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    try {
      // In a real implementation, this would be an API call
      // For now we're using the context directly
      const deleted = window.__PRODUCT_CONTEXT__?.deleteProduct(id) || false;
      
      if (deleted) {
        toast.success("Product deleted successfully!");
      } else {
        toast.error("Product not found");
      }
      
      return deleted;
    } catch (error) {
      toast.error("Failed to delete product");
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      // In a real implementation, this would be an API call
      // For now we're using the context directly
      return window.__PRODUCT_CONTEXT__?.featuredProducts || [];
    } catch (error) {
      toast.error("Failed to fetch featured products");
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      // In a real implementation, this would be an API call
      // For now we're using the context directly
      return window.__PRODUCT_CONTEXT__?.getProductsByCategory(category) || [];
    } catch (error) {
      toast.error("Failed to fetch products by category");
      throw error;
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      // In a real implementation, this would be an API call
      // For now we're doing a simple client-side search
      const allProducts = window.__PRODUCT_CONTEXT__?.products || [];
      const lowercaseQuery = query.toLowerCase();
      
      return allProducts.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      toast.error("Failed to search products");
      throw error;
    }
  }
}

export const productService = new ProductService();

// Add a global reference to access the product context in the service
// This is a workaround and would be replaced with proper API calls
declare global {
  interface Window {
    __PRODUCT_CONTEXT__?: {
      products: Product[];
      featuredProducts: Product[];
      getProductById: (id: string) => Product | undefined;
      getProductsByCategory: (category: string) => Product[];
      getRelatedProducts: (id: string, limit?: number) => Product[];
      updateProduct: (id: string, updates: Partial<Product>) => boolean;
      deleteProduct: (id: string) => boolean;
    }
  }
}
