
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
  Card,
  CardContent
} from "@/components/ui/card";
import { 
  MoreHorizontal, 
  Eye, 
  Search,
  FileText,
  Truck,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";

// Mock data - in a real app this would come from an API
const mockOrders = Array.from({ length: 20 }, (_, i) => ({
  id: `PED-${1000 + i}`,
  customer: `Cliente ${i + 1}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  total: +(Math.random() * 2000 + 100).toFixed(2),
  status: ['Processando', 'Enviado', 'Entregue', 'Cancelado'][Math.floor(Math.random() * 4)],
  items: Math.floor(Math.random() * 5) + 1,
  paymentMethod: ['Cartão de Crédito', 'Boleto', 'Transferência Bancária'][Math.floor(Math.random() * 3)]
}));

interface OrderDetailsProps {
  order: typeof mockOrders[0];
  onClose: () => void;
}

const OrderDetails = ({ order, onClose }: OrderDetailsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Pedido #{order.id}</h3>
          <p className="text-sm text-muted-foreground">Feito em {order.date}</p>
        </div>
        <Badge variant={
          order.status === 'Processando' ? 'default' :
          order.status === 'Enviado' ? 'secondary' :
          order.status === 'Entregue' ? 'secondary' : 'destructive'
        }>
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">{t('admin.orders.customer')}</p>
          <p className="text-sm">{order.customer}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">{t('admin.orders.paymentMethod')}</p>
          <p className="text-sm">{order.paymentMethod}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">{t('admin.orders.orderItems')}</h4>
        <div className="border rounded-md p-4">
          {/* Mock order items */}
          {Array.from({ length: order.items }, (_, i) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">Produto {i + 1}</p>
                <p className="text-xs text-muted-foreground">SKU: PRD-{1000 + i}</p>
              </div>
              <div className="text-right">
                <p>R$ {(Math.random() * 500 + 50).toFixed(2)}</p>
                <p className="text-xs">Qtd: {Math.floor(Math.random() * 3) + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between">
          <p className="font-medium">Total</p>
          <p className="font-medium">R$ {order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-end space-x-2 gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>{t('common.close')}</Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          {t('admin.orders.downloadInvoice')}
        </Button>
        {order.status === 'Processando' && (
          <Button>
            <Truck className="h-4 w-4 mr-2" />
            {t('admin.orders.markAsShipped')}
          </Button>
        )}
      </div>
    </div>
  );
};

// Mobile Order Card Component
const OrderCard = ({ 
  order, 
  onViewOrder 
}: { 
  order: typeof mockOrders[0];
  onViewOrder: (order: typeof mockOrders[0]) => void;
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{order.id}</h3>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>
          <Badge variant={
            order.status === 'Processando' ? 'default' :
            order.status === 'Enviado' ? 'secondary' :
            order.status === 'Entregue' ? 'secondary' : 'destructive'
          }>
            {order.status}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center text-sm py-1">
          <span>Cliente:</span>
          <span className="font-medium">{order.customer}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm py-1">
          <span>Itens:</span>
          <span className="font-medium">{order.items}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm py-1">
          <span>Total:</span>
          <span className="font-medium">R$ {order.total.toFixed(2)}</span>
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="outline" onClick={() => onViewOrder(order)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

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
      case 'Processando': return "bg-blue-100 text-blue-800";
      case 'Enviado': return "bg-yellow-100 text-yellow-800";
      case 'Entregue': return "bg-green-100 text-green-800";
      case 'Cancelado': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('admin.orders.title')}</h1>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.orders.search')}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="w-full sm:w-10">
          <Filter className="h-4 w-4" />
          <span className="sr-only">{t('admin.orders.filter')}</span>
        </Button>
      </div>
      
      {isMobile ? (
        // Mobile view - card list
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewOrder={handleViewOrder} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.orders.noOrders')}
            </div>
          )}
        </div>
      ) : (
        // Desktop view - table
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.orders.orderId')}</TableHead>
                <TableHead>{t('admin.orders.customer')}</TableHead>
                <TableHead>{t('admin.orders.date')}</TableHead>
                <TableHead>{t('admin.orders.total')}</TableHead>
                <TableHead>{t('admin.orders.status')}</TableHead>
                <TableHead>{t('admin.orders.items')}</TableHead>
                <TableHead className="w-[100px]">{t('admin.orders.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>R$ {order.total.toFixed(2)}</TableCell>
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
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {t('admin.orders.noOrders')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Details Dialog - Used for both desktop and mobile */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{t('admin.orders.details')}</DialogTitle>
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
