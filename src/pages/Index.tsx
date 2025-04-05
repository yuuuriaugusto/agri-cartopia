
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Tractor, 
  ShoppingBag, 
  Truck, 
  Settings, 
  Heart, 
  ThumbsUp,
  Filter,
  MapPin,
  Square,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/product-card';
import { useProducts } from '@/context/ProductContext';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryTabs from '@/components/products/CategoryTabs';

const Index = () => {
  const { products, categories, featuredProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter products based on search term and active category
  useEffect(() => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategory) {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, activeCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Banner Section */}
      <section className="relative bg-primary pt-24 pb-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4">
                All your agricultural needs in one place
              </h1>
              <p className="text-white/80 text-lg mb-6">
                Explore our comprehensive range of high-quality agricultural machinery and implements
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-md">
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search our products..."
                  className="pr-10 bg-white/95 border-0"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/3cd431c8-819a-42c5-b1d2-656cbb6af51a.png" 
                alt="Agricultural marketplace" 
                className="max-h-60 ml-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <CategoryTabs 
        categories={categories} 
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Product Grid */}
      <section className="py-8 bg-secondary/30">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">
              Showing {filteredProducts.length} of {products.length} results
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex gap-1">
                <Filter className="h-4 w-4" /> Filter results
              </Button>
            </div>
          </div>

          <ProductGrid products={filteredProducts} />
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search criteria.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setActiveCategory('');
              }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <Badge className="mb-2">Featured</Badge>
              <h2 className="text-3xl font-serif font-medium">Premium Products</h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="icon" onClick={scrollLeft} aria-label="Scroll left">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollRight} aria-label="Scroll right">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-4 no-scrollbar"
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565856898071-32de49702b0c?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <Badge variant="outline" className="mb-4 text-white border-white/30">Get Started Today</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-shadow">
              Ready to Upgrade Your Agricultural Equipment?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Browse our extensive catalog of premium agricultural machinery, vehicles, and implements. Our experts are ready to help you find the perfect solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="min-w-36" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white min-w-36" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
