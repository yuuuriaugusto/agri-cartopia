import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle  
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, 
  Eye, 
  Search,
  FileText,
  Truck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data - in a real app this would come from an API
const mockOrders = Array.from({ length: 20 }, (_, i) => ({
  id: `ORD-${1000 + i}`,
  customer: `Customer ${i + 1}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  total: +(Math.random() * 2000 + 100).toFixed(2),
  status: ['Processing', 'Shipped', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 4)],
  items: Math.floor(Math.random() * 5) + 1,
  paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)]
}));

interface OrderDetailsProps {
  order: typeof mockOrders[0];
  onClose: () => void;
}

const OrderDetails = ({ order, onClose }: OrderDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Order #{order.id}</h3>
          <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
        </div>
        <Badge variant={
          order.status === 'Processing' ? 'default' :
          order.status === 'Shipped' ? 'secondary' :
          order.status === 'Delivered' ? 'secondary' : 'destructive'
        }>
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Customer</p>
          <p className="text-sm">{order.customer}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Payment Method</p>
          <p className="text-sm">{order.paymentMethod}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Order Items</h4>
        <div className="border rounded-md p-4">
          {/* Mock order items */}
          {Array.from({ length: order.items }, (_, i) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">Product {i + 1}</p>
                <p className="text-xs text-muted-foreground">SKU: PRD-{1000 + i}</p>
              </div>
              <div className="text-right">
                <p>${(Math.random() * 500 + 50).toFixed(2)}</p>
                <p className="text-xs">Qty: {Math.floor(Math.random() * 3) + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between">
          <p className="font-medium">Total</p>
          <p className="font-medium">${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
        {order.status === 'Processing' && (
          <Button>
            <Truck className="h-4 w-4 mr-2" />
            Mark as Shipped
          </Button>
        )}
      </div>
    </div>
  );
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewOrder = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const filteredOrders = mockOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return "bg-blue-100 text-blue-800";
      case 'Shipped': return "bg-yellow-100 text-yellow-800";
      case 'Delivered': return "bg-green-100 text-green-800";
      case 'Cancelled': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by ID or customer name..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetails order={selectedOrder} onClose={() => setIsDetailsOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
