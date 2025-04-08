
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Calendar, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  File
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

// Definição do esquema do formulário usando Zod
const reportFormSchema = z.object({
  type: z.string({
    required_error: "Selecione um tipo de relatório",
  }),
  format: z.string({
    required_error: "Selecione um formato de relatório",
  }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

// Dados de amostra dos relatórios recentes
const recentReports = [
  {
    id: "1",
    name: "Relatório de Vendas - Abril 2025",
    type: "sales",
    format: "pdf",
    date: "2025-04-01",
    size: "2.3 MB"
  },
  {
    id: "2",
    name: "Relatório de Estoque - Abril 2025",
    type: "inventory",
    format: "excel",
    date: "2025-04-01",
    size: "1.8 MB"
  },
  {
    id: "3",
    name: "Relatório de Clientes - Março 2025",
    type: "customers",
    format: "csv",
    date: "2025-03-15",
    size: "3.1 MB"
  },
  {
    id: "4",
    name: "Relatório de Vendas - Q1 2025",
    type: "sales",
    format: "pdf",
    date: "2025-03-31",
    size: "4.5 MB"
  },
  {
    id: "5",
    name: "Relatório de Envios - Março 2025",
    type: "shipping",
    format: "excel",
    date: "2025-03-15",
    size: "1.2 MB"
  }
];

// Obter o ícone do formato do relatório
const getFormatIcon = (format: string) => {
  switch (format) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "excel":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case "csv":
      return <FileText className="h-5 w-5 text-blue-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

// Obter o nome traduzido do tipo de relatório
const getReportTypeName = (type: string, t: (key: string) => string) => {
  switch (type) {
    case "sales":
      return t('admin.reports.sales');
    case "inventory":
      return t('admin.reports.inventory');
    case "customers":
      return t('admin.reports.customers');
    case "shipping":
      return t('admin.reports.shipping');
    case "taxes":
      return t('admin.reports.taxes');
    default:
      return type;
  }
};

const Reports = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(1)), // Primeiro dia do mês atual
    to: new Date(), // Hoje
  });
  
  // Configurar o formulário
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      type: "",
      format: "",
    },
  });
  
  // Função para gerar relatório
  const onSubmit = (data: ReportFormValues) => {
    // Validar se temos um período selecionado
    if (!dateRange.from || !dateRange.to) {
      toast.error("Selecione um período para o relatório");
      return;
    }
    
    // Gerar o nome do relatório baseado nos dados
    const reportName = `${getReportTypeName(data.type, t)} - ${format(dateRange.from, "dd/MM/yyyy")} a ${format(dateRange.to, "dd/MM/yyyy")}`;
    
    // Exibir notificação de sucesso
    toast.success(`Relatório gerado: ${reportName}`, {
      description: "O download começará em breve.",
    });
    
    // Aqui você implementaria a lógica real para gerar o relatório
    console.log("Gerando relatório:", {
      ...data,
      dateRange,
      reportName,
    });
  };
  
  // Função para realizar o download de um relatório existente
  const handleDownloadReport = (report: typeof recentReports[0]) => {
    toast.success(`Download iniciado: ${report.name}`);
    // Aqui você implementaria a lógica real para baixar o relatório
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('admin.reports.title')}</h1>
      
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">{t('admin.reports.generate')}</TabsTrigger>
          <TabsTrigger value="recent">{t('admin.reports.recentReports')}</TabsTrigger>
        </TabsList>
        
        {/* Conteúdo da aba de geração de relatórios */}
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Novo Relatório</CardTitle>
              <CardDescription>
                Selecione as opções abaixo para gerar um relatório personalizado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.reports.type')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de relatório" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sales">{t('admin.reports.sales')}</SelectItem>
                              <SelectItem value="inventory">{t('admin.reports.inventory')}</SelectItem>
                              <SelectItem value="customers">{t('admin.reports.customers')}</SelectItem>
                              <SelectItem value="taxes">{t('admin.reports.taxes')}</SelectItem>
                              <SelectItem value="shipping">{t('admin.reports.shipping')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.reports.format')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o formato" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pdf">{t('admin.reports.pdf')}</SelectItem>
                              <SelectItem value="excel">{t('admin.reports.excel')}</SelectItem>
                              <SelectItem value="csv">{t('admin.reports.csv')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormLabel>{t('admin.reports.period')}</FormLabel>
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      className="mt-2"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {t('admin.reports.generate')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conteúdo da aba de relatórios recentes */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.reports.recentReports')}</CardTitle>
              <CardDescription>
                Relatórios gerados recentemente. Clique para baixar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentReports.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFormatIcon(report.format)}
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(report.date), "dd/MM/yyyy")} · {report.size}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">{t('admin.reports.download')}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t('admin.reports.noReports')}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
