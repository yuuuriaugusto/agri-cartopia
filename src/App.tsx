
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider, useProducts } from "@/context/ProductContext";
import { ThemeProvider } from "@/contexto/ContextoTema";
import { TranslationProvider } from "@/contexto/ContextoTraducao";
import { lazy, useEffect, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import LayoutAdmin from "@/components/layout/AdminLayout";
import LayoutAdminMovel from "@/components/layout/MobileAdminLayout";
import Loader from "@/components/common/Loader";

const Indice = lazy(() => import("./pages/Indice"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Depoimentos = lazy(() => import("./pages/Depoimentos"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Contato = lazy(() => import("./pages/Contato"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductsAdmin = lazy(() => import("./pages/admin/Products"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const Settings = lazy(() => import("./pages/admin/Settings"));

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
                          <Route path="categorias" element={<Categories />} />
                          <Route path="analytics" element={<Analytics />} />
                          <Route path="relatorios" element={<Reports />} />
                          <Route path="configuracoes" element={<Settings />} />
                        </Route>
                      ) : (
                        /* Rotas Admin Desktop */
                        <Route path="/admin" element={<LayoutAdmin />}>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="produtos" element={<ProductsAdmin />} />
                          <Route path="pedidos" element={<Orders />} />
                          <Route path="clientes" element={<Customers />} />
                          <Route path="categorias" element={<Categories />} />
                          <Route path="analytics" element={<Analytics />} />
                          <Route path="relatorios" element={<Reports />} />
                          <Route path="configuracoes" element={<Settings />} />
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
