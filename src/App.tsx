
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider, useProducts } from "@/context/ProductContext";
import { ProvedorTema } from "@/contexto/ContextoTema";
import { ProvedorTraducao } from "@/contexto/ContextoTraducao";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import DetalhesProduto from "./pages/DetalhesProduto";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import RastreamentoPedido from "./pages/RastreamentoPedido";
import NaoEncontrado from "./pages/NaoEncontrado";
import Login from "./pages/Login";
import Depoimentos from "./pages/Depoimentos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import LayoutAdminMovel from "./components/layout/LayoutAdminMovel";
import Dashboard from "./pages/admin/Dashboard";
import ProdutosAdmin from "./pages/admin/Produtos";
import Pedidos from "./pages/admin/Pedidos";
import Clientes from "./pages/admin/Clientes";

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
      <ProvedorTema>
        <ProvedorTraducao>
          <ProductProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ExpositorContextoProdutos>
                    <Routes>
                      {/* Rotas Públicas */}
                      <Route path="/" element={<Index />} />
                      <Route path="/produtos" element={<Produtos />} />
                      <Route path="/produtos/:id" element={<DetalhesProduto />} />
                      <Route path="/carrinho" element={<Carrinho />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/rastreamento-pedido" element={<RastreamentoPedido />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/depoimentos" element={<Depoimentos />} />
                      <Route path="/sobre" element={<Sobre />} />
                      <Route path="/contato" element={<Contato />} />
                      
                      {/* Rotas Administrativas - Renderizadas condicionalmente com base no dispositivo */}
                      {isMobile ? (
                        /* Rotas Admin Mobile */
                        <Route path="/admin" element={<LayoutAdminMovel />}>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="produtos" element={<ProdutosAdmin />} />
                          <Route path="pedidos" element={<Pedidos />} />
                          <Route path="clientes" element={<Clientes />} />
                        </Route>
                      ) : (
                        /* Rotas Admin Desktop */
                        <Route path="/admin" element={<LayoutAdmin />}>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="produtos" element={<ProdutosAdmin />} />
                          <Route path="pedidos" element={<Pedidos />} />
                          <Route path="clientes" element={<Clientes />} />
                        </Route>
                      )}
                      
                      {/* 404 - Rota padrão */}
                      <Route path="*" element={<NaoEncontrado />} />
                    </Routes>
                  </ExpositorContextoProdutos>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </ProductProvider>
        </ProvedorTraducao>
      </ProvedorTema>
    </QueryClientProvider>
  );
};

export default App;
