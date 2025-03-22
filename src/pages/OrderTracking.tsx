
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Truck, Package, AlertCircle, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Sample order status data
const orderStatus = {
  orderNumber: 'AC-12345678',
  orderDate: '2023-08-15',
  estimatedDelivery: '2023-08-25',
  status: 'shipped',
  trackingNumber: 'TRACK-9876543210',
  currentLocation: 'Chicago Distribution Center',
  statusHistory: [
    { status: 'ordered', date: '2023-08-15T10:30:00Z', message: 'Order placed' },
    { status: 'processed', date: '2023-08-16T14:45:00Z', message: 'Payment confirmed and order processed' },
    { status: 'shipped', date: '2023-08-18T09:15:00Z', message: 'Order has shipped from our warehouse' },
    { status: 'delivered', date: '2023-08-25T16:00:00Z', message: 'Pending delivery', isUpcoming: true },
  ],
  items: [
    { 
      id: 'tractor-1', 
      name: 'AgriPro X360 Tractor', 
      quantity: 1, 
      price: 75000,
      image: 'https://images.unsplash.com/photo-1591638848542-563781150c17?q=80&w=1974&auto=format&fit=crop'
    },
    { 
      id: 'utility-vehicle-1', 
      name: 'TerrainRunner XUV Farm Utility Vehicle', 
      quantity: 1, 
      price: 18500,
      image: 'https://images.unsplash.com/photo-1573677157383-d8d1ecb324b4?q=80&w=1974&auto=format&fit=crop'
    }
  ],
  shippingAddress: {
    name: 'John Doe',
    address: '123 Farm Road',
    city: 'Agritown',
    state: 'AT',
    zipCode: '12345',
    country: 'United States'
  },
  paymentMethod: 'Credit Card (**** 3456)',
  subtotal: 93500,
  shipping: 0,
  tax: 7480,
  total: 100980
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to format time from ISO string
const formatTime = (isoString: string) => {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(isoString).toLocaleTimeString('en-US', options);
};

// Helper function to format prices
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

const OrderTracking = () => {
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  
  // Calculate progress value based on status
  const getProgressValue = () => {
    const statusIndex = orderStatus.statusHistory.findIndex(
      item => item.status === orderStatus.status
    );
    return ((statusIndex + 1) / orderStatus.statusHistory.length) * 100;
  };
  
  // Get status step based on a status name
  const getStatusStep = (status: string) => {
    const index = orderStatus.statusHistory.findIndex(item => item.status === status);
    const currentIndex = orderStatus.statusHistory.findIndex(item => item.status === orderStatus.status);
    
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container py-8">
          <h1 className="text-3xl font-serif font-medium mb-8">Order Tracking</h1>
          
          {/* Order Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="bg-secondary">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Order #{orderStatus.orderNumber}</CardTitle>
                      <CardDescription>Placed on {formatDate(orderStatus.orderDate)}</CardDescription>
                    </div>
                    <Button variant="outline" className="mt-4 sm:mt-0" asChild>
                      <Link to="/products">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Shop Again
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Status Overview */}
                  <div className="bg-muted rounded-lg p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                          {orderStatus.status === 'delivered' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Truck className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">Status: 
                            <span className="capitalize ml-1">
                              {orderStatus.status === 'ordered' ? 'Order Placed' :
                               orderStatus.status === 'processed' ? 'Order Processed' :
                               orderStatus.status === 'shipped' ? 'In Transit' :
                               orderStatus.status === 'delivered' ? 'Delivered' : orderStatus.status}
                            </span>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {orderStatus.status === 'shipped' 
                              ? `Your order is on its way from ${orderStatus.currentLocation}` 
                              : orderStatus.status === 'delivered'
                                ? 'Your order has been delivered'
                                : `Expected delivery by ${formatDate(orderStatus.estimatedDelivery)}`
                            }
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button size="sm" variant="outline" asChild>
                          <a href="#" className="flex items-center gap-1">
                            <Download className="h-4 w-4" /> Invoice
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <Progress value={getProgressValue()} className="h-2" />
                    
                    <div className="grid grid-cols-4 mt-2">
                      {['ordered', 'processed', 'shipped', 'delivered'].map((status) => (
                        <div
                          key={status}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full mb-1",
                              getStatusStep(status) === 'completed' && "bg-primary",
                              getStatusStep(status) === 'current' && "bg-primary",
                              getStatusStep(status) === 'upcoming' && "bg-muted-foreground/30"
                            )}
                          />
                          <span className={cn(
                            "text-xs text-center capitalize",
                            getStatusStep(status) === 'completed' && "text-primary font-medium",
                            getStatusStep(status) === 'current' && "text-primary font-medium",
                            getStatusStep(status) === 'upcoming' && "text-muted-foreground"
                          )}>
                            {status === 'ordered' ? 'Ordered' :
                             status === 'processed' ? 'Processed' :
                             status === 'shipped' ? 'Shipped' : 'Delivered'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tracking Timeline */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Tracking Timeline</h3>
                    <div className="relative">
                      {orderStatus.statusHistory.map((step, index) => (
                        <div key={index} className="flex mb-6 last:mb-0">
                          <div className="relative mr-4">
                            <div
                              className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center",
                                step.isUpcoming
                                  ? "border-2 border-muted-foreground/30 text-muted-foreground"
                                  : "bg-primary text-white"
                              )}
                            >
                              {step.status === 'ordered' ? (
                                <Package className="h-5 w-5" />
                              ) : step.status === 'processed' ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : step.status === 'shipped' ? (
                                <Truck className="h-5 w-5" />
                              ) : (
                                <CheckCircle className="h-5 w-5" />
                              )}
                            </div>
                            {index !== orderStatus.statusHistory.length - 1 && (
                              <div
                                className={cn(
                                  "absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-10",
                                  step.isUpcoming || orderStatus.statusHistory[index + 1].isUpcoming
                                    ? "bg-muted-foreground/30"
                                    : "bg-primary"
                                )}
                              />
                            )}
                          </div>
                          <div className="flex-grow pt-1">
                            <div className="flex justify-between">
                              <h4
                                className={cn(
                                  "font-medium",
                                  step.isUpcoming ? "text-muted-foreground" : ""
                                )}
                              >
                                {step.status === 'ordered' ? 'Order Placed' :
                                 step.status === 'processed' ? 'Order Processed' :
                                 step.status === 'shipped' ? 'Order Shipped' : 'Delivery'}
                              </h4>
                              <span
                                className={cn(
                                  "text-sm",
                                  step.isUpcoming ? "text-muted-foreground" : ""
                                )}
                              >
                                {formatDate(step.date)} at {formatTime(step.date)}
                              </span>
                            </div>
                            <p
                              className={cn(
                                "text-sm",
                                step.isUpcoming ? "text-muted-foreground/70" : "text-muted-foreground"
                              )}
                            >
                              {step.message}
                            </p>
                            
                            {step.status === 'shipped' && !step.isUpcoming && (
                              <div className="bg-muted rounded p-3 mt-2 text-sm">
                                <p className="font-medium">Tracking Number: {orderStatus.trackingNumber}</p>
                                <p className="text-muted-foreground">
                                  Current Location: {orderStatus.currentLocation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Items in this order */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Items in this Order</h3>
                    <div className="border rounded-lg overflow-hidden">
                      {orderStatus.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className={cn(
                            "p-4 flex items-center gap-4",
                            idx !== orderStatus.items.length - 1 && "border-b"
                          )}
                        >
                          <div className="w-16 h-16 flex-shrink-0 bg-secondary rounded overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <Link
                              to={`/products/${item.id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              {/* Order Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(orderStatus.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{orderStatus.shipping === 0 ? 'Free' : formatPrice(orderStatus.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatPrice(orderStatus.tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatPrice(orderStatus.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Shipping Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <address className="not-italic">
                    <p className="font-medium">{orderStatus.shippingAddress.name}</p>
                    <p>{orderStatus.shippingAddress.address}</p>
                    <p>
                      {orderStatus.shippingAddress.city}, {orderStatus.shippingAddress.state}{' '}
                      {orderStatus.shippingAddress.zipCode}
                    </p>
                    <p>{orderStatus.shippingAddress.country}</p>
                  </address>
                </CardContent>
              </Card>
              
              {/* Payment Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{orderStatus.paymentMethod}</p>
                </CardContent>
              </Card>
              
              {/* Track Another Order */}
              <Card>
                <CardHeader>
                  <CardTitle>Track Another Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <Input
                      placeholder="Enter order number"
                      value={searchOrderNumber}
                      onChange={(e) => setSearchOrderNumber(e.target.value)}
                      className="mb-4"
                    />
                    <Button>
                      Track Order <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Need Help */}
          <div className="mt-12 bg-muted rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Need Help With Your Order?</h3>
                  <p className="text-muted-foreground">
                    If you have any questions or concerns about your order, our customer support team is here to help.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild>
                  <Link to="/faq">View FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
