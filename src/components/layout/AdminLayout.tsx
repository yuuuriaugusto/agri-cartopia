
import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
  TrendingUp,
  FileBarChart,
  Tag
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const handleLogout = async () => {
    await userService.logout();
    toast.success("Logout realizado com sucesso");
    navigate("/login");
  };

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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="flex h-16 items-center border-b px-4">
            <Link to="/admin/dashboard" className="text-xl font-bold text-primary">
              {t('admin.panel')}
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('admin.navigation')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        tooltip={item.title}
                      >
                        <Link to={item.path}>
                          <item.icon size={20} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              {t('admin.logout')}
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="h-14 border-b flex items-center px-6">
              <SidebarTrigger />
              <div className="ml-4 font-medium">{t('admin.panel')}</div>
              <div className="ml-auto flex items-center gap-4">
                {/* Admin user profile button could go here */}
              </div>
            </header>
            <div className="flex-1 p-6 overflow-auto">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
