
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, ArrowLeft, Package, Shield, Star, ChevronDown, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/product-card';
import { Seo } from '@/components/seo/Seo';
import AddToCartButton from '@/components/ui/botao-adicionar-carrinho';
import { useProducts } from '@/context/ProductContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts } = useProducts();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const product = getProductById(id || '');
  const relatedProducts = getRelatedProducts(id || '', 4);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Product not found</h2>
          <Button onClick={() => navigate('/produtos')}>Back to Products</Button>
        </div>
      </div>
    );
  }
  
  const { 
    name, 
    brand, 
    category, 
    subcategory, 
    price, 
    images, 
    description, 
    features, 
    specs, 
    stock, 
    rating, 
    reviews, 
    isNew, 
    discount 
  } = product;
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  
  const discountedPrice = discount 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(price * (1 - discount / 100))
    : null;
  
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, stock));
  };
  
  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Seo title={`${name} | ${brand}`} description={description?.slice(0, 150)} />
      
      <main className="flex-grow pt-24">
        <div className="container py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/produtos" className="hover:text-foreground">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link 
              to={`/produtos?category=${category}`} 
              className="hover:text-foreground capitalize"
            >
              {category.replace('-', ' ')}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium truncate">{name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="sticky top-24">
              <div className="relative overflow-hidden rounded-xl aspect-square bg-secondary">
                <img 
                  src={images[activeImageIndex]} 
                  alt={name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                
                {/* Image navigation */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        idx === activeImageIndex ? "bg-primary w-6" : "bg-white/70 hover:bg-white"
                      )}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
                
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-80 hover:opacity-100"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-80 hover:opacity-100"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {isNew && (
                    <Badge className="bg-primary text-white font-medium">New</Badge>
                  )}
                  {discount && (
                    <Badge className="bg-destructive text-white font-medium">
                      -{discount}%
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Thumbnail images */}
              <div className="flex mt-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "rounded-lg overflow-hidden border-2 transition-all",
                      idx === activeImageIndex ? "border-primary" : "border-transparent hover:border-muted"
                    )}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx}`} 
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-muted-foreground">
                    {brand}
                  </Badge>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="ml-1 font-medium">{rating}</span>
                    <span className="ml-1 text-muted-foreground">({reviews} reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-serif font-medium mb-4">{name}</h1>
                
                <div className="flex items-end gap-3 mb-4">
                  {discount ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground line-through">{formattedPrice}</span>
                        <span className="text-2xl font-semibold text-destructive">{discountedPrice}</span>
                      </div>
                      <Badge variant="outline" className="text-destructive border-destructive">
                        Save {discount}%
                      </Badge>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold">{formattedPrice}</span>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-6">{description}</p>
                
                {/* Add to cart */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="flex border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="rounded-none border-r"
                    >
                      -
                    </Button>
                    <div className="w-12 flex items-center justify-center font-medium">
                      {quantity}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={incrementQuantity}
                      disabled={quantity >= stock}
                      className="rounded-none border-l"
                    >
                      +
                    </Button>
                  </div>
                  
                  <div className="flex-grow">
                    <AddToCartButton 
                      product={product} 
                      showText 
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Product details */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-medium">Availability:</span>{' '}
                      {stock > 0 ? (
                        <span className="text-green-600">In Stock ({stock} available)</span>
                      ) : (
                        <span className="text-red-500">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-medium">Free shipping</span>{' '}
                      <span className="text-muted-foreground">on orders over $5,000</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-medium">2-Year Warranty</span>{' '}
                      <span className="text-muted-foreground">included with purchase</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                {/* Product tabs */}
                <Tabs defaultValue="features">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <ChevronRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="specifications" className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
                    <div className="space-y-2">
                      {Object.entries(specs).map(([key, value], idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "grid grid-cols-3 py-2",
                            idx !== Object.entries(specs).length - 1 && "border-b"
                          )}
                        >
                          <span className="font-medium">{key}</span>
                          <span className="col-span-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shipping" className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="delivery">
                        <AccordionTrigger>Delivery Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Package className="h-5 w-5 mt-0.5 text-primary" />
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-muted-foreground">7-10 business days</p>
                                <p className="text-sm">Free on orders over $5,000 ($350 otherwise)</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Truck className="h-5 w-5 mt-0.5 text-primary" />
                              <div>
                                <p className="font-medium">Express Delivery</p>
                                <p className="text-sm text-muted-foreground">3-5 business days</p>
                                <p className="text-sm">$750 shipping fee</p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="installation">
                        <AccordionTrigger>Installation Services</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-4">
                            We offer professional installation services for most of our agricultural machinery and equipment. Our expert technicians ensure your equipment is properly set up for optimal performance.
                          </p>
                          <p className="font-medium">Installation fees:</p>
                          <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground">
                            <li>Basic installation: $500 - $1,500</li>
                            <li>Complex machinery: $2,000 - $5,000</li>
                            <li>Custom installation: Contact for pricing</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="returns">
                        <AccordionTrigger>Returns & Warranty</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-4">
                            All our products come with a 30-day return policy and a minimum 2-year manufacturer warranty. Some products may have extended warranty options available.
                          </p>
                          <p className="font-medium">Return conditions:</p>
                          <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground mb-4">
                            <li>Product must be unused and in original packaging</li>
                            <li>Return shipping costs paid by customer</li>
                            <li>15% restocking fee may apply</li>
                          </ul>
                          <p>
                            Contact our customer service at <a href="mailto:support@agricartopia.com" className="text-primary hover:underline">support@agricartopia.com</a> for warranty claims and returns.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-serif font-medium mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
          
          <div className="mt-16 text-center">
            <Button variant="outline" asChild>
              <Link to="/produtos" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
