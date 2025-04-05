
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTranslation } from '@/hooks/use-translation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
