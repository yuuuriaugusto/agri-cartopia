
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign 
} from "lucide-react";

const StatCard = ({ title, value, icon, description, className }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  description: string;
  className?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-full ${className}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          icon={<DollarSign className="h-4 w-4" />}
          description="Monthly revenue growth +2.5%"
          className="bg-green-100 text-green-700"
        />
        <StatCard
          title="Orders"
          value="432"
          icon={<ShoppingCart className="h-4 w-4" />}
          description="25 new orders this week"
          className="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Products"
          value="156"
          icon={<Package className="h-4 w-4" />}
          description="12 out of stock"
          className="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          title="Customers"
          value="2,134"
          icon={<Users className="h-4 w-4" />}
          description="53 new customers this month"
          className="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Here we would use real data, for now using placeholders */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="font-medium">Customer #{i+1}</div>
                    <div className="text-sm text-muted-foreground">Order #{1000 + i}</div>
                  </div>
                  <div className="font-medium">${(Math.random() * 1000).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Activity #{i+1}</p>
                    <p className="text-xs text-muted-foreground">
                      {i % 2 === 0 
                        ? "New order placed" 
                        : i % 3 === 0 
                          ? "New product added" 
                          : "Customer registered"
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
