
import { createContext, useContext, ReactNode, useState, useMemo } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  images: string[];
  description: string;
  features: string[];
  specs: { [key: string]: string };
  stock: number;
  rating: number;
  reviews: number;
  brand: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export interface CategoryAttribute {
  name: string;
  type: 'text' | 'number' | 'range' | 'select';
  options?: string[]; // For select type
  min?: number; // For range type
  max?: number; // For range type
  unit?: string; // For range type with units (e.g., km, hours)
}

export interface CategoryFilter {
  category: string;
  attributes: CategoryAttribute[];
}

interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getRelatedProducts: (id: string, limit?: number) => Product[];
  // Category and filter related
  categories: string[];
  categoryFilters: CategoryFilter[];
  // CRUD operations
  addProduct: (product: Omit<Product, "id">) => string;
  updateProduct: (id: string, updates: Partial<Product>) => boolean;
  deleteProduct: (id: string) => boolean;
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: "tractor-1",
    name: "AgriPro X360 Tractor",
    category: "farm-machinery",
    subcategory: "tractors",
    price: 75000,
    images: [
      "https://images.unsplash.com/photo-1591638848542-563781150c17?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588770423042-9d91a4bae96d?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598197301104-8c3ed0e70b9f?q=80&w=1974&auto=format&fit=crop",
    ],
    description: "The AgriPro X360 is a high-performance tractor designed for modern farming operations. With its powerful engine and advanced control systems, it offers exceptional efficiency and reliability for a wide range of agricultural tasks.",
    features: [
      "360HP diesel engine",
      "Advanced hydraulic system",
      "Spacious climate-controlled cabin",
      "Precision GPS navigation",
      "Touch-screen control interface",
      "Automatic transmission"
    ],
    specs: {
      "Engine": "6-cylinder turbo diesel",
      "Horsepower": "360HP",
      "Transmission": "PowerShift automatic",
      "Hydraulics": "Closed-center, load sensing",
      "Lift Capacity": "8,500 kg",
      "Fuel Capacity": "600 liters",
      "Weight": "10,450 kg",
      "Dimensions": "6.2m x 2.55m x 3.28m",
      "Wheelbase": "3.05m"
    },
    stock: 5,
    rating: 4.8,
    reviews: 24,
    brand: "AgriPro",
    isFeatured: true
  },
  {
    id: "harvester-1",
    name: "CropMaster 7200 Combine Harvester",
    category: "farm-machinery",
    subcategory: "harvesters",
    price: 235000,
    images: [
      "https://images.unsplash.com/photo-1591103265942-6198c0d5ff69?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586514612136-255abdb9cbe1?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547858074-09fe698ede73?q=80&w=1974&auto=format&fit=crop"
    ],
    description: "The CropMaster 7200 is a state-of-the-art combine harvester that delivers exceptional performance for grain harvesting. Its advanced threshing technology ensures maximum grain quality with minimal losses.",
    features: [
      "High-capacity grain tank",
      "Advanced separation system",
      "Automated header height control",
      "Intelligent crop flow management",
      "Precision cutting system",
      "Smart yield monitoring"
    ],
    specs: {
      "Engine": "9-liter diesel engine",
      "Horsepower": "450HP",
      "Grain Tank": "12,000 liters",
      "Cutting Width": "Up to 12.2m",
      "Threshing System": "Dual rotor",
      "Fuel Capacity": "800 liters",
      "Weight": "18,700 kg",
      "Dimensions": "9.7m x 3.7m x 4.0m"
    },
    stock: 3,
    rating: 4.9,
    reviews: 16,
    brand: "CropMaster",
    isFeatured: true
  },
  {
    id: "farm-truck-1",
    name: "RuralHauler F750 Farm Truck",
    category: "vehicles",
    subcategory: "trucks",
    price: 82500,
    images: [
      "https://images.unsplash.com/photo-1612599538264-cdf9a135ace7?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535082623926-b39352a03fb7?q=80&w=2013&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507431714684-958d767e1bee?q=80&w=2070&auto=format&fit=crop"
    ],
    description: "Designed specifically for agricultural use, the RuralHauler F750 combines rugged durability with exceptional hauling capabilities, making it perfect for farm operations and rural transport needs.",
    features: [
      "Heavy-duty chassis",
      "High load capacity",
      "All-terrain capability",
      "Trailer connection system",
      "Reinforced suspension",
      "Efficient diesel engine"
    ],
    specs: {
      "Engine": "7.2-liter turbo diesel",
      "Horsepower": "350HP",
      "Torque": "1,050 Nm",
      "Load Capacity": "10,000 kg",
      "Towing Capacity": "18,000 kg",
      "Fuel Economy": "5.8 km/l",
      "Drive": "4x4",
      "Transmission": "6-speed automatic"
    },
    stock: 7,
    rating: 4.7,
    reviews: 32,
    brand: "RuralHauler",
    isFeatured: true
  },
  {
    id: "irrigation-system-1",
    name: "AquaFlow Precision Irrigation System",
    category: "farm-machinery",
    subcategory: "irrigation",
    price: 28500,
    images: [
      "https://images.unsplash.com/photo-1621586983600-49dffedd7f0b?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505672678657-cc7037095e60?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586514612391-33a7ff31efc3?q=80&w=1974&auto=format&fit=crop"
    ],
    description: "The AquaFlow Precision Irrigation System utilizes advanced soil monitoring and targeted water distribution to optimize crop growth while conserving water resources.",
    features: [
      "Automated sprinkler control",
      "Soil moisture monitoring",
      "Weather-adaptive scheduling",
      "Mobile app control",
      "Water usage analytics",
      "Sectional irrigation zones"
    ],
    specs: {
      "Coverage Area": "Up to 120 acres",
      "Control System": "Computerized with 4G connectivity",
      "Water Efficiency": "Up to 40% water savings",
      "Power Source": "Solar with battery backup",
      "Flow Rate": "Variable up to 900 GPM",
      "Installation": "Modular, expandable design"
    },
    stock: 12,
    rating: 4.6,
    reviews: 28,
    brand: "AquaFlow",
    isNew: true
  },
  {
    id: "planter-1",
    name: "SeedPro 3600 Precision Planter",
    category: "farm-machinery",
    subcategory: "planters",
    price: 145000,
    images: [
      "https://images.unsplash.com/photo-1597858520171-563a8e8b9925?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591373471767-ee2e7d656803?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587224026742-62ed4dc481f1?q=80&w=1974&auto=format&fit=crop"
    ],
    description: "The SeedPro 3600 Precision Planter delivers unmatched accuracy in seed placement, ensuring optimal spacing, depth control, and seed-to-soil contact for maximum crop emergence and yield potential.",
    features: [
      "Multi-hybrid planting capability",
      "Individual row control",
      "Downforce automation",
      "Seed delivery monitoring",
      "Variable rate application",
      "Integrated field mapping"
    ],
    specs: {
      "Row Units": "24-row configuration",
      "Row Spacing": "Adjustable from 15\" to 30\"",
      "Seed Capacity": "120 bushels total",
      "Operating Speed": "Up to 10 mph",
      "Hydraulic Downforce": "0-400 lbs per row",
      "Width": "18.3m (transport: 4.6m)",
      "Control System": "Touchscreen with GPS integration"
    },
    stock: 4,
    rating: 4.8,
    reviews: 19,
    brand: "SeedPro",
    isFeatured: true
  },
  {
    id: "utility-vehicle-1",
    name: "TerrainRunner XUV Farm Utility Vehicle",
    category: "vehicles",
    subcategory: "utility-vehicles",
    price: 18500,
    images: [
      "https://images.unsplash.com/photo-1573677157383-d8d1ecb324b4?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547922378-a49be8041e85?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1649570708304-1ababa4e87ea?q=80&w=1974&auto=format&fit=crop"
    ],
    description: "Perfect for quick transportation around the farm, the TerrainRunner XUV combines exceptional off-road capability with practical features designed specifically for agricultural operations.",
    features: [
      "All-wheel drive",
      "Towing capability",
      "Cargo bed with hydraulic lift",
      "Weather-resistant design",
      "Multi-purpose attachments",
      "Comfortable seating for 3"
    ],
    specs: {
      "Engine": "850cc EFI gas engine",
      "Horsepower": "65HP",
      "Cargo Capacity": "450 kg",
      "Towing Capacity": "900 kg",
      "Top Speed": "75 km/h",
      "Fuel Capacity": "42 liters",
      "Ground Clearance": "28 cm",
      "Wheelbase": "199 cm"
    },
    stock: 15,
    rating: 4.7,
    reviews: 42,
    brand: "TerrainRunner",
    isNew: true
  },
  {
    id: "tiller-1",
    name: "SoilMaster Pro Rotary Tiller",
    category: "farm-machinery",
    subcategory: "tillers",
    price: 14500,
    images: [
      "https://images.unsplash.com/photo-1589924800753-0c0b54efaa3b?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558968557-5eb1e647f4c3?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587367570061-c745d350dcf8?q=80&w=1933&auto=format&fit=crop"
    ],
    description: "The SoilMaster Pro Rotary Tiller provides superior soil preparation with adjustable tilling depth and width, creating the ideal seedbed for maximum crop productivity.",
    features: [
      "Heavy-duty steel construction",
      "Adjustable tilling depth",
      "Variable working width",
      "Reversible tines",
      "PTO-driven operation",
      "Quick-attach system"
    ],
    specs: {
      "Working Width": "2.0 to 3.5 meters",
      "Tilling Depth": "Up to 25 cm",
      "PTO Requirement": "60+ HP",
      "Weight": "850 kg",
      "Rotor Speed": "240 RPM",
      "Number of Tines": "42",
      "Three-Point Hitch": "Category II"
    },
    stock: 9,
    rating: 4.5,
    reviews: 23,
    brand: "SoilMaster",
    discount: 15
  },
  {
    id: "sprayer-1",
    name: "FieldGuard 5000 Precision Sprayer",
    category: "farm-machinery",
    subcategory: "sprayers",
    price: 125000,
    images: [
      "https://images.unsplash.com/photo-1585336261176-3e8db4d9f708?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591338459378-411dd1df029c?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629413309041-fdfa7d336396?q=80&w=1974&auto=format&fit=crop"
    ],
    description: "The FieldGuard 5000 Precision Sprayer delivers unmatched accuracy in application, featuring advanced nozzle control, section control, and spray rate management for efficient crop protection and nutrient delivery.",
    features: [
      "Individual nozzle control",
      "Section automation",
      "Drift reduction technology",
      "Auto-dilution system",
      "Terrain compensation",
      "Real-time application mapping"
    ],
    specs: {
      "Boom Width": "36.5 meters",
      "Tank Capacity": "5,000 liters",
      "Nozzle Spacing": "50 cm",
      "Application Rate": "50-500 liters/hectare",
      "Operating Speed": "Up to 30 km/h",
      "Control System": "Fully computerized with GPS",
      "Pump Capacity": "700 liters/minute"
    },
    stock: 6,
    rating: 4.8,
    reviews: 17,
    brand: "FieldGuard",
    isFeatured: true
  }
];

// Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  
  // Get featured products
  const featuredProducts = products.filter(product => product.isFeatured);
  
  // Extract unique categories
  const categories = useMemo(() => 
    Array.from(new Set(products.map(p => p.category))), 
    [products]
  );
  
  // Generate dynamic category filters based on product specs
  const categoryFilters = useMemo(() => {
    const filters: CategoryFilter[] = [];
    
    // Process each category
    categories.forEach(category => {
      const categoryProducts = products.filter(p => p.category === category);
      const allSpecs = new Set<string>();
      
      // Collect all unique spec keys for this category
      categoryProducts.forEach(product => {
        Object.keys(product.specs).forEach(key => allSpecs.add(key));
      });
      
      // Create attributes for each spec
      const attributes: CategoryAttribute[] = [];
      
      // Add common attributes (always present)
      attributes.push({
        name: 'brand',
        type: 'select',
        options: Array.from(new Set(categoryProducts.map(p => p.brand)))
      });
      
      // Process specific specs for this category
      allSpecs.forEach(specKey => {
        // Determine the type of this attribute based on values
        const values = categoryProducts
          .map(p => p.specs[specKey])
          .filter(Boolean);
        
        if (values.length === 0) return;
        
        // Check if all values are numbers
        const allNumbers = values.every(v => !isNaN(Number(v)));
        
        if (allNumbers) {
          // It's a numeric attribute
          const numbers = values.map(v => Number(v));
          attributes.push({
            name: specKey,
            type: 'range',
            min: Math.min(...numbers),
            max: Math.max(...numbers),
            unit: determineUnit(specKey)
          });
        } else {
          // It's a categorical attribute
          attributes.push({
            name: specKey,
            type: 'select',
            options: Array.from(new Set(values))
          });
        }
      });
      
      filters.push({
        category,
        attributes
      });
    });
    
    return filters;
  }, [categories, products]);
  
  // Helper function to determine unit type based on spec name
  function determineUnit(specName: string): string {
    const lowerName = specName.toLowerCase();
    if (lowerName.includes('horsepower')) return 'HP';
    if (lowerName.includes('weight')) return 'kg';
    if (lowerName.includes('capacity')) return 'L';
    if (lowerName.includes('hours')) return 'hrs';
    if (lowerName.includes('year')) return '';
    if (lowerName.includes('mileage') || lowerName.includes('odometer')) return 'km';
    return '';
  }
  
  // Get product by ID
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };
  
  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };
  
  // Get related products
  const getRelatedProducts = (id: string, limit: number = 4) => {
    const currentProduct = getProductById(id);
    if (!currentProduct) return [];
    
    return products
      .filter(product => 
        product.id !== id && 
        (product.category === currentProduct.category || 
         product.subcategory === currentProduct.subcategory)
      )
      .slice(0, limit);
  };

  // CRUD operations for products
  const addProduct = (product: Omit<Product, "id">) => {
    const newId = `product-${Date.now()}`;
    const newProduct = { id: newId, ...product };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    return newId;
  };
  
  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updated = false;
    
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === id) {
          updated = true;
          return { ...product, ...updates };
        }
        return product;
      })
    );
    
    return updated;
  };
  
  const deleteProduct = (id: string) => {
    let deleted = false;
    
    setProducts(prevProducts => {
      const newProducts = prevProducts.filter(product => {
        if (product.id === id) {
          deleted = true;
          return false;
        }
        return true;
      });
      
      return newProducts;
    });
    
    return deleted;
  };
  
  const value = {
    products,
    featuredProducts,
    getProductById,
    getProductsByCategory,
    getRelatedProducts,
    categories,
    categoryFilters,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// Hook
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
