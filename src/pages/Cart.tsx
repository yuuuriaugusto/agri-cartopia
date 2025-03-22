
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const navigate = useNavigate();
  
  const shipping = totalPrice > 5000 ? 0 : 350;
  const discount = isPromoApplied ? totalPrice * 0.1 : 0;
  const grandTotal = totalPrice + shipping - discount;
  
  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'agri10') {
      setIsPromoApplied(true);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="container py-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-serif font-medium mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any products to your cart yet. Browse our catalog to find premium agricultural equipment.
              </p>
              <Button size="lg" asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container py-8">
          <h1 className="text-3xl font-serif font-medium mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium">
                      Your Items ({totalItems})
                    </h2>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-muted-foreground">
                          <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear shopping cart?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove all items from your cart. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={clearCart}>
                            Clear Cart
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                {items.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "p-6 flex flex-col sm:flex-row gap-4",
                      idx !== items.length - 1 && "border-b"
                    )}
                  >
                    <div className="w-24 h-24 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <Link 
                            to={`/products/${item.id}`}
                            className="text-lg font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="text-muted-foreground">
                            {formatPrice(item.price)} per unit
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-9 w-9 rounded-none border-r"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="w-10 flex items-center justify-center font-medium">
                              {item.quantity}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-9 w-9 rounded-none border-l"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="w-24 text-right font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeItem(item.id)}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/products" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Continue Shopping
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Promo code" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-40"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handlePromoCode}
                    disabled={isPromoApplied}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border overflow-hidden sticky top-24">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-medium">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    
                    {isPromoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(grandTotal)}</span>
                    </div>
                    
                    {isPromoApplied && (
                      <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <p>Promo code <strong>AGRI10</strong> has been applied to your order.</p>
                      </div>
                    )}
                    
                    <Button 
                      size="lg" 
                      className="w-full mt-4"
                      onClick={() => navigate('/checkout')}
                    >
                      Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      By proceeding to checkout, you agree to our <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
