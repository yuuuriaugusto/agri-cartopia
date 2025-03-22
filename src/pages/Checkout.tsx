
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, CheckCircle, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';

type CheckoutStep = 'shipping' | 'payment' | 'review';

const Checkout = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  const shipping = shippingMethod === 'express' ? 750 : (totalPrice > 5000 ? 0 : 350);
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
    window.scrollTo(0, 0);
  };
  
  const handlePlaceOrder = () => {
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/order-tracking');
  };
  
  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container py-8">
          <h1 className="text-3xl font-serif font-medium mb-8">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                      step.id === currentStep 
                        ? "border-primary bg-primary text-white" 
                        : step.id === 'review' && currentStep === 'review'
                          ? "border-primary bg-primary text-white"
                          : steps.indexOf({ id: currentStep, label: '' }) > index
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {steps.indexOf({ id: currentStep, label: '' }) > index ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  
                  <span 
                    className={cn(
                      "ml-2 hidden sm:inline-block",
                      step.id === currentStep 
                        ? "font-medium text-foreground" 
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className={cn(
                        "w-12 sm:w-24 h-0.5 mx-2",
                        steps.indexOf({ id: currentStep, label: '' }) > index
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-medium">Shipping Information</h2>
                  </div>
                  
                  <form onSubmit={handleShippingSubmit} className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          required 
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          required 
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          required 
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          required 
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        required 
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="col-span-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          required 
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          required 
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          required 
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={shippingInfo.country} 
                        onValueChange={(value) => setShippingInfo({...shippingInfo, country: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="MX">Mexico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
                      <div className="space-y-4">
                        <Card className={cn(
                          "cursor-pointer transition-all",
                          shippingMethod === 'standard' ? "border-primary ring-1 ring-primary" : ""
                        )} onClick={() => setShippingMethod('standard')}>
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0">
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                shippingMethod === 'standard' ? "border-primary" : "border-muted-foreground/30"
                              )}>
                                {shippingMethod === 'standard' && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h4 className="font-medium">Standard Shipping</h4>
                                <span>
                                  {totalPrice > 5000 ? 'Free' : formatPrice(350)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Delivery in 7-10 business days
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className={cn(
                          "cursor-pointer transition-all",
                          shippingMethod === 'express' ? "border-primary ring-1 ring-primary" : ""
                        )} onClick={() => setShippingMethod('express')}>
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0">
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                shippingMethod === 'express' ? "border-primary" : "border-muted-foreground/30"
                              )}>
                                {shippingMethod === 'express' && (
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h4 className="font-medium">Express Delivery</h4>
                                <span>{formatPrice(750)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Delivery in 3-5 business days
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <Button type="submit">
                        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-medium">Payment Information</h2>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit} className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Checkbox 
                          id="sameBillingAddress" 
                          checked={sameBillingAddress} 
                          onCheckedChange={(checked) => {
                            setSameBillingAddress(checked === true);
                            if (checked) {
                              setBillingInfo({
                                firstName: shippingInfo.firstName,
                                lastName: shippingInfo.lastName,
                                address: shippingInfo.address,
                                city: shippingInfo.city,
                                state: shippingInfo.state,
                                zipCode: shippingInfo.zipCode,
                                country: shippingInfo.country,
                              });
                            }
                          }}
                        />
                        <Label htmlFor="sameBillingAddress">
                          Same as shipping address
                        </Label>
                      </div>
                      
                      {!sameBillingAddress && (
                        <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
                          <h3 className="font-medium">Billing Address</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="billingFirstName">First Name</Label>
                              <Input 
                                id="billingFirstName" 
                                required 
                                value={billingInfo.firstName}
                                onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="billingLastName">Last Name</Label>
                              <Input 
                                id="billingLastName" 
                                required 
                                value={billingInfo.lastName}
                                onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="billingAddress">Street Address</Label>
                            <Input 
                              id="billingAddress" 
                              required 
                              value={billingInfo.address}
                              onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="col-span-2">
                              <Label htmlFor="billingCity">City</Label>
                              <Input 
                                id="billingCity" 
                                required 
                                value={billingInfo.city}
                                onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="billingState">State</Label>
                              <Input 
                                id="billingState" 
                                required 
                                value={billingInfo.state}
                                onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="billingZipCode">ZIP Code</Label>
                              <Input 
                                id="billingZipCode" 
                                required 
                                value={billingInfo.zipCode}
                                onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="card">Credit Card</TabsTrigger>
                          <TabsTrigger value="paypal">PayPal</TabsTrigger>
                          <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="card" className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <div className="relative">
                                <Input 
                                  id="cardNumber" 
                                  placeholder="1234 5678 9012 3456" 
                                  required
                                />
                                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input 
                                  id="expiryDate" 
                                  placeholder="MM/YY" 
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input 
                                  id="cvv" 
                                  placeholder="123" 
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="nameOnCard">Name on Card</Label>
                              <Input 
                                id="nameOnCard" 
                                placeholder="John Doe" 
                                required
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="paypal" className="pt-4">
                          <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                              You will be redirected to PayPal to complete your payment securely.
                            </p>
                            <img 
                              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                              alt="PayPal" 
                              className="h-12 mx-auto"
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="bank" className="pt-4">
                          <div className="space-y-4">
                            <p className="text-muted-foreground">
                              Please use the following information to make a bank transfer:
                            </p>
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Bank Name</p>
                                  <p className="text-muted-foreground">AgriBank National</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Account Name</p>
                                  <p className="text-muted-foreground">AgriCartopia Inc.</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Account Number</p>
                                  <p className="text-muted-foreground">1234567890</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Routing Number</p>
                                  <p className="text-muted-foreground">987654321</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Your order will be processed once the payment is confirmed.
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setCurrentStep('shipping')}
                      >
                        Back to Shipping
                      </Button>
                      <Button type="submit">
                        Review Order <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Review Step */}
              {currentStep === 'review' && (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-medium">Review Your Order</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Shipping Information */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">Shipping Information</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setCurrentStep('shipping')}
                          >
                            Edit
                          </Button>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Truck className="h-5 w-5 mt-0.5 text-primary" />
                            <div>
                              <p className="font-medium">
                                {shippingInfo.firstName} {shippingInfo.lastName}
                              </p>
                              <p className="text-muted-foreground">
                                {shippingInfo.address}
                              </p>
                              <p className="text-muted-foreground">
                                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                              </p>
                              <p className="text-muted-foreground">
                                {shippingInfo.email} | {shippingInfo.phone}
                              </p>
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Shipping Method:</span>{' '}
                                {shippingMethod === 'express' ? 'Express Delivery (3-5 days)' : 'Standard Shipping (7-10 days)'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Information */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">Payment Information</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setCurrentStep('payment')}
                          >
                            Edit
                          </Button>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 mt-0.5 text-primary" />
                            <div>
                              {paymentMethod === 'card' && (
                                <>
                                  <p className="font-medium">Credit Card</p>
                                  <p className="text-muted-foreground">
                                    **** **** **** 3456
                                  </p>
                                  <p className="text-muted-foreground">
                                    Expiry: 12/24
                                  </p>
                                </>
                              )}
                              
                              {paymentMethod === 'paypal' && (
                                <>
                                  <p className="font-medium">PayPal</p>
                                  <p className="text-muted-foreground">
                                    {shippingInfo.email}
                                  </p>
                                </>
                              )}
                              
                              {paymentMethod === 'bank' && (
                                <>
                                  <p className="font-medium">Bank Transfer</p>
                                  <p className="text-muted-foreground">
                                    Bank: AgriBank National
                                  </p>
                                  <p className="text-muted-foreground">
                                    Account: 1234567890
                                  </p>
                                </>
                              )}
                              
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Billing Address:</span>{' '}
                                {sameBillingAddress ? 'Same as shipping address' : (
                                  <>
                                    {billingInfo.address}, {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Order Items ({totalItems})</h3>
                        <div className="divide-y border rounded-lg overflow-hidden">
                          {items.map((item) => (
                            <div key={item.id} className="p-4 flex gap-4">
                              <div className="w-16 h-16 flex-shrink-0 bg-secondary rounded overflow-hidden">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-grow">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatPrice(item.price)} each
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Tax (8%)</span>
                          <span>{formatPrice(tax)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between py-2 text-lg font-semibold">
                          <span>Total</span>
                          <span>{formatPrice(grandTotal)}</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Secure Checkout</p>
                          <p className="text-sm text-green-700">
                            Your payment information is securely processed. We do not store credit card details.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep('payment')}
                        >
                          Back to Payment
                        </Button>
                        <Button 
                          size="lg" 
                          className="px-8"
                          onClick={handlePlaceOrder}
                        >
                          Place Order
                        </Button>
                      </div>
                      
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        By placing your order, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border overflow-hidden sticky top-24">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-medium">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="max-h-64 overflow-y-auto mb-4 space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-secondary rounded overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Free shipping on orders over $5,000</p>
                      <p className="text-sm text-muted-foreground">
                        Standard delivery: 7-10 business days
                      </p>
                    </div>
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

export default Checkout;
