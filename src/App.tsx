
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider, useProducts } from "@/context/ProductContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to expose ProductContext to window for service access
const ProductContextExposer = ({ children }: { children: React.ReactNode }) => {
  const productContext = useProducts();
  
  useEffect(() => {
    // Expose the product context to the window object for the service to use
    // In a real app, this would be replaced with API calls
    window.__PRODUCT_CONTEXT__ = productContext;
    
    return () => {
      // Cleanup on unmount
      delete window.__PRODUCT_CONTEXT__;
    };
  }, [productContext]);
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProductProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ProductContextExposer>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProductContextExposer>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ProductProvider>
  </QueryClientProvider>
);

export default App;
