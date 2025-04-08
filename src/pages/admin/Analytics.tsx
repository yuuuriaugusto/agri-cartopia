
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { 
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell
} from "recharts";
import { 
  Download,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar
} from "lucide-react";

// Dados de amostra para gráficos
const salesData = [
  { month: 'Jan', receita: 18500, pedidos: 120 },
  { month: 'Fev', receita: 22000, pedidos: 145 },
  { month: 'Mar', receita: 25500, pedidos: 160 },
  { month: 'Abr', receita: 21000, pedidos: 135 },
  { month: 'Mai', receita: 26500, pedidos: 170 },
  { month: 'Jun', receita: 31000, pedidos: 190 },
  { month: 'Jul', receita: 29500, pedidos: 180 },
  { month: 'Ago', receita: 33000, pedidos: 205 },
  { month: 'Set', receita: 36500, pedidos: 220 },
  { month: 'Out', receita: 34500, pedidos: 210 },
  { month: 'Nov', receita: 39000, pedidos: 240 },
  { month: 'Dez', receita: 47000, pedidos: 280 },
];

const categoryData = [
  { name: 'Maquinário Agrícola', valor: 42000 },
  { name: 'Veículos', valor: 31000 },
  { name: 'Sistemas de Irrigação', valor: 15000 },
  { name: 'Implementos', valor: 25000 },
];

const topProducts = [
  { name: 'Trator AgriPro X360', vendas: 15, receita: 1125000 },
  { name: 'Colheitadeira CropMaster 7200', vendas: 8, receita: 1880000 },
  { name: 'Caminhão RuralHauler F750', vendas: 12, receita: 990000 },
  { name: 'Sistema de Irrigação AquaFlow', vendas: 25, receita: 712500 },
  { name: 'Plantadora SeedPro 3600', vendas: 10, receita: 1450000 },
];

// Cores para o gráfico de pizza
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('month');
  
  // Cálculo de métricas
  const totalRevenue = salesData.reduce((acc, item) => acc + item.receita, 0);
  const totalOrders = salesData.reduce((acc, item) => acc + item.pedidos, 0);
  const averageOrderValue = totalRevenue / totalOrders;
  const customers = 450; // Exemplo
  
  // Filtrar dados com base no período selecionado
  const getFilteredData = () => {
    const currentDate = new Date();
    
    if (period === 'today') {
      return [salesData[currentDate.getMonth()]]; // Apenas o mês atual
    } else if (period === 'week') {
      // Últimos 7 dias (simplificado como últimos 2 meses para este exemplo)
      return salesData.slice(-2);
    } else if (period === 'month') {
      // Últimos 30 dias (simplificado como últimos 3 meses para este exemplo)
      return salesData.slice(-3);
    } else if (period === 'quarter') {
      // Último trimestre (3 meses)
      return salesData.slice(-3);
    } else if (period === 'year') {
      // Ano inteiro
      return salesData;
    }
    
    return salesData; // Padrão: retorna todos os dados
  };
  
  const filteredSalesData = getFilteredData();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.analytics.title')}</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('admin.analytics.period')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t('admin.analytics.today')}</SelectItem>
              <SelectItem value="week">{t('admin.analytics.week')}</SelectItem>
              <SelectItem value="month">{t('admin.analytics.month')}</SelectItem>
              <SelectItem value="quarter">{t('admin.analytics.quarter')}</SelectItem>
              <SelectItem value="year">{t('admin.analytics.year')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.analytics.revenue')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.analytics.orders')}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +15.2% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.analytics.averageOrder')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageOrderValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              +4.3% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.analytics.customers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers}</div>
            <p className="text-xs text-muted-foreground">
              +12.8% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs para diferentes tipos de análises */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendências de Vendas</TabsTrigger>
          <TabsTrigger value="categories">Vendas por Categoria</TabsTrigger>
          <TabsTrigger value="products">Produtos Mais Vendidos</TabsTrigger>
        </TabsList>
        
        {/* Tendências de Vendas */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.salesTrend')}</CardTitle>
              <CardDescription>Comparação da receita e número de pedidos ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredSalesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="receita"
                    stroke="#8884d8"
                    name="Receita (R$)"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pedidos"
                    stroke="#82ca9d"
                    name="Pedidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vendas por Categoria */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.salesByCategory')}</CardTitle>
              <CardDescription>Distribuição de vendas por categoria de produto</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center h-[400px]">
              <div className="w-full md:w-1/2 h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Bar dataKey="valor" fill="#8884d8" name="Valor (R$)">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Produtos Mais Vendidos */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.topProducts')}</CardTitle>
              <CardDescription>Produtos com melhor desempenho no período</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vendas" fill="#8884d8" name="Unidades Vendidas" />
                  <Bar dataKey="receita" fill="#82ca9d" name="Receita (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
