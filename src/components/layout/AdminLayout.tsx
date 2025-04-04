
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
  
  const handleLogout = async () => {
    await userService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Products", path: "/admin/products", icon: Package },
    { title: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { title: "Customers", path: "/admin/customers", icon: Users },
    { title: "Categories", path: "/admin/categories", icon: Tag },
    { title: "Sales Analytics", path: "/admin/analytics", icon: TrendingUp },
    { title: "Reports", path: "/admin/reports", icon: FileBarChart },
    { title: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="flex h-16 items-center border-b px-4">
            <Link to="/admin/dashboard" className="text-xl font-bold text-primary">
              Admin Panel
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="h-14 border-b flex items-center px-6">
              <SidebarTrigger />
              <div className="ml-4 font-medium">Admin Dashboard</div>
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
