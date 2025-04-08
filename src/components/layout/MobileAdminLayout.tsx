
import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/UserService";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  TrendingUp,
  FileBarChart,
  Tag
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileAdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    await userService.logout();
    toast.success("Logout realizado com sucesso");
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { title: t('admin.dashboard'), path: "/admin/dashboard", icon: LayoutDashboard },
    { title: t('admin.products'), path: "/admin/produtos", icon: Package },
    { title: t('admin.orders'), path: "/admin/pedidos", icon: ShoppingCart },
    { title: t('admin.customers'), path: "/admin/clientes", icon: Users },
    { title: t('admin.categories'), path: "/admin/categorias", icon: Tag },
    { title: t('admin.analytics'), path: "/admin/analytics", icon: TrendingUp },
    { title: t('admin.reports'), path: "/admin/relatorios", icon: FileBarChart },
    { title: t('admin.settings'), path: "/admin/configuracoes", icon: Settings },
  ];

  // Get current page title
  const currentPageTitle = menuItems.find(
    item => isActive(item.path)
  )?.title || t('admin.panel');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <SheetHeader>
              <SheetTitle className="text-left">{t('admin.panel')}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  }`}
                  onClick={closeMenu}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 h-auto" 
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                {t('admin.logout')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-4 font-medium">{currentPageTitle}</div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 pb-20 overflow-auto">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-30 py-2 px-4">
        <div className="grid grid-cols-5 gap-1">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 rounded-md ${
                isActive(item.path) 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileAdminLayout;
