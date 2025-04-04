
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
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, 
  Search, 
  Mail, 
  User, 
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

// Mock data - in a real app this would come from an API
const mockCustomers = Array.from({ length: 20 }, (_, i) => ({
  id: `CUST-${1000 + i}`,
  name: `${['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'][Math.floor(Math.random() * 6)]} ${['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis'][Math.floor(Math.random() * 6)]}`,
  email: `customer${i+1}@example.com`,
  phone: `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`,
  joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  totalSpent: +(Math.random() * 5000 + 100).toFixed(2),
  orders: Math.floor(Math.random() * 20) + 1,
  address: `${Math.floor(Math.random() * 1000) + 1} ${['Main', 'Oak', 'Pine', 'Maple', 'Cedar'][Math.floor(Math.random() * 5)]} St, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]}`
}));

interface CustomerDetailsProps {
  customer: typeof mockCustomers[0];
  onClose: () => void;
}

const CustomerDetails = ({ customer, onClose }: CustomerDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-12 w-12 text-gray-500" />
        </div>
        <h3 className="text-xl font-bold">{customer.name}</h3>
        <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{customer.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Joined on {customer.joinDate}</span>
        </div>
      </div>

      <div className="border rounded-md p-4 space-y-4">
        <h4 className="font-medium">Customer Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{customer.orders}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Recent Orders</h4>
        <div className="space-y-2">
          {Array.from({ length: Math.min(3, customer.orders) }, (_, i) => (
            <div key={i} className="border rounded-md p-3 flex justify-between">
              <div>
                <div className="font-medium">Order #{`ORD-${1000 + i}`}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${(Math.random() * 500 + 50).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">
                  {['Processing', 'Shipped', 'Delivered'][Math.floor(Math.random() * 3)]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Contact Customer
        </Button>
      </div>
    </div>
  );
};

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewCustomer = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers by name, email or ID..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.joinDate}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              Detailed information about the customer.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <CustomerDetails 
              customer={selectedCustomer} 
              onClose={() => setIsDetailsOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
