
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider, useProducts } from "@/context/ProductContext";
import { ThemeProvider } from "@/contexto/ContextoTema";
import { TranslationProvider } from "@/contexto/ContextoTraducao";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Indice from "./pages/Indice";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Depoimentos from "./pages/Depoimentos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import LayoutAdmin from "@/components/layout/AdminLayout";
import LayoutAdminMovel from "@/components/layout/MobileAdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";

const queryClient = new QueryClient();

// Componente para expor o contexto de produtos para o serviço
const ExpositorContextoProdutos = ({ children }: { children: React.ReactNode }) => {
  const contextoProdutos = useProducts();
  
  useEffect(() => {
    // Expor o contexto de produtos para o objeto window para o serviço usar
    // Em um aplicativo real, isso seria substituído por chamadas de API
    window.__PRODUCT_CONTEXT__ = contextoProdutos;
    
    return () => {
      // Limpar ao desmontar
      delete window.__PRODUCT_CONTEXT__;
    };
  }, [contextoProdutos]);
  
  return <>{children}</>;
};

const App = () => {
  const isMobile = useIsMobile();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TranslationProvider>
          <ProductProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ExpositorContextoProdutos>
                    <Routes>
                      {/* Rotas Públicas */}
                      <Route path="/" element={<Indice />} />
                      <Route path="/produtos" element={<Products />} />
                      <Route path="/produtos/:id" element={<ProductDetail />} />
                      <Route path="/carrinho" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/rastreamento-pedido" element={<OrderTracking />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/depoimentos" element={<Depoimentos />} />
                      <Route path="/sobre" element={<Sobre />} />
                      <Route path="/contato" element={<Contato />} />
                      
                      {/* Rotas Administrativas - Renderizadas condicionalmente com base no dispositivo */}
                      {isMobile ? (
                        /* Rotas Admin Mobile */
                        <Route path="/admin" element={<LayoutAdminMovel />}>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="produtos" element={<ProductsAdmin />} />
                          <Route path="pedidos" element={<Orders />} />
                          <Route path="clientes" element={<Customers />} />
                        </Route>
                      ) : (
                        /* Rotas Admin Desktop */
                        <Route path="/admin" element={<LayoutAdmin />}>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="produtos" element={<ProductsAdmin />} />
                          <Route path="pedidos" element={<Orders />} />
                          <Route path="clientes" element={<Customers />} />
                        </Route>
                      )}
                      
                      {/* 404 - Rota padrão */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ExpositorContextoProdutos>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </ProductProvider>
        </TranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
