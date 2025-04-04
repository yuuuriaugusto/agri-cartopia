
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  ChevronRight
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

const MobileActivityCard = ({ activity, index }: { activity: string, index: number }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <div className="flex gap-2 items-center">
      <div className="w-2 h-2 rounded-full bg-blue-500 mt-0.5"></div>
      <div>
        <p className="text-sm font-medium">Activity #{index+1}</p>
        <p className="text-xs text-muted-foreground">{activity}</p>
      </div>
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </div>
);

const Dashboard = () => {
  const isMobile = useIsMobile();
  
  // Example recent activity data
  const recentActivities = [
    "New order placed by Customer #12",
    "Product 'Tractor X200' added to inventory",
    "Customer John Doe registered", 
    "Payment received for Order #1042",
    "Shipment dispatched for Order #1039"
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Revenue"
          value="$45,231"
          icon={<DollarSign className="h-4 w-4" />}
          description="+2.5% this month"
          className="bg-green-100 text-green-700"
        />
        <StatCard
          title="Orders"
          value="432"
          icon={<ShoppingCart className="h-4 w-4" />}
          description="25 new this week"
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
          description="53 new this month"
          className="bg-purple-100 text-purple-700"
        />
      </div>

      {isMobile ? (
        // Mobile layout - stacked cards
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">Customer #{i+1}</div>
                      <div className="text-xs text-muted-foreground">Order #{1000 + i}</div>
                    </div>
                    <div className="font-medium">${(Math.random() * 1000).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              {recentActivities.map((activity, i) => (
                <MobileActivityCard key={i} activity={activity} index={i} />
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        // Desktop layout - grid
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
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Activity #{i+1}</p>
                      <p className="text-xs text-muted-foreground">{activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
