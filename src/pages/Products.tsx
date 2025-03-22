
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Sliders, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/product-card';
import { useProducts, type Product } from '@/context/ProductContext';

const Products = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // Get unique categories and brands from products
  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand)));
  
  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by price range
    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, selectedBrands]);
  
  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory) {
      searchParams.set('category', selectedCategory);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }, [selectedCategory]);
  
  // Set category from URL on mount
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
  }, []);
  
  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brand]);
    } else {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('featured');
    setPriceRange([0, 250000]);
    setSelectedBrands([]);
  };
  
  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Category</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="all-categories" 
              checked={selectedCategory === ''} 
              onCheckedChange={() => setSelectedCategory('')}
            />
            <Label htmlFor="all-categories">All Categories</Label>
          </div>
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox 
                id={category} 
                checked={selectedCategory === category} 
                onCheckedChange={() => setSelectedCategory(category)}
              />
              <Label htmlFor={category} className="capitalize">
                {category.replace('-', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min-price">Min</Label>
            <Input 
              id="min-price" 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="max-price">Max</Label>
            <Input 
              id="max-price" 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox 
                id={`brand-${brand}`} 
                checked={selectedBrands.includes(brand)} 
                onCheckedChange={(checked) => handleBrandChange(brand, checked === true)}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4">
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Page Header */}
        <div className="bg-secondary py-12">
          <div className="container">
            <h1 className="text-4xl font-serif font-medium mb-4">Agricultural Equipment</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our comprehensive range of high-quality agricultural machinery, vehicles, and implements designed for modern farming operations.
            </p>
          </div>
        </div>
        
        <div className="container py-8">
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Input 
                placeholder="Search products..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
              
              {isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <FiltersContent />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
                      <SheetClose asChild>
                        <Button className="w-full">Apply Filters</Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={resetFilters} 
                  className="gap-2"
                >
                  <Sliders className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters (Desktop) */}
            {!isMobile && (
              <div className="w-64 flex-shrink-0">
                <div className="sticky top-24 bg-card shadow-sm rounded-lg border p-6">
                  <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5" /> Filters
                  </h2>
                  <FiltersContent />
                </div>
              </div>
            )}
            
            {/* Product Grid */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} products found
                </span>
                
                {selectedCategory && (
                  <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1 capitalize"
                  >
                    {selectedCategory.replace('-', ' ')}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full"
                      onClick={() => setSelectedCategory('')}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedBrands.map(brand => (
                  <Badge 
                    key={brand}
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {brand}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full"
                      onClick={() => handleBrandChange(brand, false)}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                
                {(selectedCategory || selectedBrands.length > 0 || searchTerm) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={resetFilters}
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={resetFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
