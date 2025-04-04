
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Sliders, ChevronDown, Grid, ListFilter, LayoutGrid } from 'lucide-react';
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
import { useProducts, type Product, CategoryFilter } from '@/context/ProductContext';
import { DynamicFilter } from '@/components/products/DynamicFilter';

const Products = () => {
  const { products, categories, categoryFilters } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryFilter | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Update active category filter when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filter = categoryFilters.find(cf => cf.category === selectedCategory);
      setActiveCategoryFilter(filter || null);
    } else {
      setActiveCategoryFilter(null);
    }
    // Reset filters when category changes
    setActiveFilters({});
  }, [selectedCategory, categoryFilters]);
  
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
    
    // Apply dynamic filters
    if (Object.keys(activeFilters).length > 0) {
      filtered = filtered.filter(product => {
        for (const [key, value] of Object.entries(activeFilters)) {
          // Skip empty filters
          if (!value || (Array.isArray(value) && value.length === 0)) continue;
          
          // Handle range filters
          if (key.endsWith('_min')) {
            const baseKey = key.replace('_min', '');
            const specValue = Number(product.specs[baseKey]);
            if (isNaN(specValue) || specValue < value) return false;
          }
          else if (key.endsWith('_max')) {
            const baseKey = key.replace('_max', '');
            const specValue = Number(product.specs[baseKey]);
            if (isNaN(specValue) || specValue > value) return false;
          }
          // Handle brand filter (which is a direct product property)
          else if (key === 'brand') {
            if (Array.isArray(value) && !value.includes(product.brand)) return false;
          }
          // Handle other spec-based filters
          else if (Array.isArray(value)) {
            const specValue = product.specs[key];
            if (!specValue || !value.includes(specValue)) return false;
          }
        }
        return true;
      });
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
  }, [products, searchTerm, selectedCategory, sortBy, activeFilters]);
  
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
  
  const handleFilterChange = (attribute: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [attribute]: value
    }));
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('featured');
    setActiveFilters({});
  };
  
  // Filter badge display
  const getFilterBadges = () => {
    const badges = [];
    
    if (selectedCategory) {
      badges.push({
        label: selectedCategory.replace('-', ' '),
        onRemove: () => setSelectedCategory('')
      });
    }
    
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;
      
      // Skip min/max range labels - they'll be displayed as one combined badge
      if (key.endsWith('_min') || key.endsWith('_max')) {
        const baseKey = key.replace(/_min|_max/g, '');
        
        // Only add the badge if we haven't processed this range filter yet
        if (!badges.some(b => b.key === baseKey)) {
          const min = activeFilters[`${baseKey}_min`];
          const max = activeFilters[`${baseKey}_max`];
          if (min !== undefined || max !== undefined) {
            const attribute = activeCategoryFilter?.attributes.find(a => a.name === baseKey);
            badges.push({
              key: baseKey,
              label: `${baseKey}: ${min || '0'} - ${max || '∞'} ${attribute?.unit || ''}`,
              onRemove: () => {
                const newFilters = {...activeFilters};
                delete newFilters[`${baseKey}_min`];
                delete newFilters[`${baseKey}_max`];
                setActiveFilters(newFilters);
              }
            });
          }
        }
      } 
      else if (Array.isArray(value)) {
        value.forEach(v => {
          badges.push({
            key: `${key}-${v}`,
            label: `${key}: ${v}`,
            onRemove: () => {
              setActiveFilters(prev => ({
                ...prev,
                [key]: prev[key].filter((item: any) => item !== v)
              }));
            }
          });
        });
      }
    });
    
    return badges;
  };

  const FilterContent = () => (
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
      
      {activeCategoryFilter && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dynamic Filters</h3>
          <DynamicFilter 
            categoryFilter={activeCategoryFilter}
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>
      )}
      
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
              
              {!isMobile && (
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
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
                      <FilterContent />
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
                  <FilterContent />
                </div>
              </div>
            )}
            
            {/* Product Grid/List */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} products found
                </span>
                
                {getFilterBadges().map((badge) => (
                  <Badge 
                    key={badge.key || badge.label}
                    variant="secondary" 
                    className="flex items-center gap-1 capitalize"
                  >
                    {badge.label}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full"
                      onClick={badge.onRemove}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                
                {(selectedCategory || Object.keys(activeFilters).length > 0 || searchTerm) && (
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
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                        <div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.features.slice(0, 3).map((feature, i) => (
                              <Badge key={i} variant="outline">{feature}</Badge>
                            ))}
                            {product.features.length > 3 && (
                              <Badge variant="outline">+{product.features.length - 3} more</Badge>
                            )}
                          </div>
                          <div className="mt-auto flex items-end justify-between">
                            <div>
                              <div className="text-xl font-bold">${product.price.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">Brand: {product.brand}</div>
                            </div>
                            <Button asChild>
                              <a href={`/products/${product.id}`}>View Details</a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
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
