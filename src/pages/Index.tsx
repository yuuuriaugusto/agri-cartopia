
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Tractor, ShoppingBag, Truck, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/product-card';
import { useProducts } from '@/context/ProductContext';

const Index = () => {
  const { featuredProducts } = useProducts();
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop",
      title: "Precision Agricultural Machinery",
      subtitle: "Cutting-edge equipment for modern farming"
    },
    {
      url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop",
      title: "Farm Vehicles & Transportation",
      subtitle: "Reliable solutions for agricultural logistics"
    },
    {
      url: "https://images.unsplash.com/photo-1592982957607-62d5a49e0625?q=80&w=2075&auto=format&fit=crop",
      title: "Complete Farming Solutions",
      subtitle: "Everything you need for successful agriculture"
    }
  ];

  const categories = [
    { name: "Farm Machinery", icon: <Tractor />, path: "/products?category=farm-machinery" },
    { name: "Irrigation Systems", icon: <Settings />, path: "/products?category=irrigation" },
    { name: "Vehicles", icon: <Truck />, path: "/products?category=vehicles" },
    { name: "Implements", icon: <ShoppingBag />, path: "/products?category=implements" },
  ];

  // Auto rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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

      {/* Hero Section */}
      <section className="relative h-screen">
        {heroImages.map((image, idx) => (
          <div
            key={idx}
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000",
              idx === heroImageIndex ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${image.url})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        <div className="container relative z-10 h-full flex flex-col justify-center items-start text-white">
          <Badge variant="outline" className="mb-4 text-white border-white/30 bg-black/20 backdrop-blur-sm">
            Premium Agricultural Equipment
          </Badge>

          <h1 className="text-balance max-w-3xl text-shadow-lg text-5xl sm:text-6xl md:text-7xl font-serif font-semibold mb-4 opacity-0 animate-fade-in" style={{animationDelay: '300ms', animationFillMode: 'forwards'}}>
            {heroImages[heroImageIndex].title}
          </h1>
          
          <p className="text-balance max-w-xl text-white/90 text-lg md:text-xl mb-8 opacity-0 animate-fade-in" style={{animationDelay: '500ms', animationFillMode: 'forwards'}}>
            {heroImages[heroImageIndex].subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in" style={{animationDelay: '700ms', animationFillMode: 'forwards'}}>
            <Button size="lg" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>

        {/* Hero navigation */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroImageIndex(idx)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                idx === heroImageIndex ? "bg-white w-10" : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`View slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-2">Explore</Badge>
            <h2 className="text-4xl font-serif font-medium mb-4">Product Categories</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Discover our comprehensive range of agricultural machinery and equipment, designed to enhance productivity and efficiency in farming operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <Link 
                key={idx} 
                to={category.path}
                className="group relative h-64 overflow-hidden rounded-xl bg-earth-900 text-white transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950 to-transparent z-10" />
                <div className="absolute inset-0 bg-earth-900 group-hover:bg-primary transition-colors duration-300 opacity-60" />
                <div className="relative z-20 h-full flex flex-col justify-end p-6">
                  <div className="mb-4 p-3 rounded-full bg-white/10 backdrop-blur-sm w-fit">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm group-hover:text-white transition-colors">
                    Explore our selection →
                  </p>
                </div>
              </Link>
            ))}
          </div>
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

      {/* Feature Banner */}
      <section className="py-16 bg-gradient-radial from-earth-100 to-earth-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-2">Why Choose Us</Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                Premium Agricultural Equipment for Modern Farming
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg">
                At AgriCartopia, we provide high-quality agricultural machinery and implements designed to enhance productivity, efficiency, and sustainability in modern farming operations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <Tractor className="h-5 w-5" />, title: "Top Quality Machinery", desc: "Premium equipment from trusted manufacturers" },
                  { icon: <Shield className="h-5 w-5" />, title: "Extended Warranty", desc: "Comprehensive coverage for your peace of mind" },
                  { icon: <Settings className="h-5 w-5" />, title: "Expert Maintenance", desc: "Professional service and support" },
                  { icon: <Truck className="h-5 w-5" />, title: "Fast Delivery", desc: "Quick and reliable shipping nationwide" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1589924743720-a0fbf6ef9b91?q=80&w=1974&auto=format&fit=crop" 
                alt="Modern tractor in field" 
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg max-w-xs animate-slide-up">
                <p className="font-medium mb-2">Customer Satisfaction</p>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  "The quality and performance of equipment from AgriCartopia has transformed our farming operations."
                </p>
              </div>
            </div>
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
