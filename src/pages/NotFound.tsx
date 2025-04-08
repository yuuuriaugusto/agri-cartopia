
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center p-8">
          <h1 className="text-7xl font-bold mb-4 text-primary">404</h1>
          <p className="text-2xl font-medium mb-6">Página não encontrada</p>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
