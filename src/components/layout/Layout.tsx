
import { ReactNode } from 'react';
import BarraNavegacao from './BarraNavegacao';
import Rodape from './Rodape';
import { useTraducao } from '@/hooks/use-translation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTraducao();
  
  return (
    <div className="flex flex-col min-h-screen">
      <BarraNavegacao />
      <main className="flex-1">
        {children}
      </main>
      <Rodape />
    </div>
  );
};

export default Layout;
