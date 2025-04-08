
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import {
  UploadCloud,
  CreditCard,
  Truck,
  BadgePercent,
  Mail,
  Users,
  Save,
} from "lucide-react";

// Esquema para o formulário de configurações gerais
const generalSettingsSchema = z.object({
  storeName: z.string().min(2, { message: "Nome da loja é obrigatório" }),
  storeUrl: z.string().url({ message: "URL da loja deve ser válida" }),
  storeEmail: z.string().email({ message: "Email deve ser válido" }),
  storePhone: z.string().min(8, { message: "Telefone deve ser válido" }),
  storeAddress: z.string().min(5, { message: "Endereço da loja é obrigatório" }),
  currency: z.string(),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

// Esquema para o formulário de envio
const shippingSettingsSchema = z.object({
  freeShippingThreshold: z.string(),
  defaultShippingCost: z.string(),
  shippingMethods: z.string().array().min(1),
  defaultShippingMethod: z.string(),
});

// Esquema para o formulário de pagamento
const paymentSettingsSchema = z.object({
  acceptedPaymentMethods: z.string().array().min(1),
  defaultPaymentMethod: z.string(),
  paymentGateways: z.string().array(),
});

const Settings = () => {
  const { t } = useTranslation();
  
  // Formulário para configurações gerais
  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      storeName: "AgriCartopia",
      storeUrl: "https://agricartopia.com.br",
      storeEmail: "contato@agricartopia.com.br",
      storePhone: "(11) 5555-1234",
      storeAddress: "Av. Paulista, 1000, São Paulo - SP, 01310-100",
      currency: "BRL",
    },
  });
  
  // Função para salvar configurações gerais
  const onSubmitGeneral = (values: GeneralSettingsFormValues) => {
    toast.success(t('admin.settings.saved'), {
      description: "As configurações gerais foram atualizadas com sucesso.",
    });
    console.log(values);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('admin.settings.title')}</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto">
          <TabsTrigger value="general" className="text-center py-2">
            {t('admin.settings.general')}
          </TabsTrigger>
          <TabsTrigger value="shipping" className="text-center py-2">
            {t('admin.settings.shipping')}
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-center py-2">
            {t('admin.settings.payment')}
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-center py-2">
            {t('admin.settings.tax')}
          </TabsTrigger>
          <TabsTrigger value="email" className="text-center py-2">
            {t('admin.settings.email')}
          </TabsTrigger>
          <TabsTrigger value="users" className="text-center py-2">
            {t('admin.settings.users')}
          </TabsTrigger>
        </TabsList>
        
        {/* Configurações Gerais */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.settings.general')}</CardTitle>
              <CardDescription>
                Configurações gerais da sua loja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.settings.storeName')}</FormLabel>
                          <FormControl>
                            <Input placeholder="AgriCartopia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="storeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.settings.storeUrl')}</FormLabel>
                          <FormControl>
                            <Input placeholder="https://seusite.com.br" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="storeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.settings.storeEmail')}</FormLabel>
                          <FormControl>
                            <Input placeholder="contato@seusite.com.br" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="storePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.settings.storePhone')}</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 0000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.settings.currency')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a moeda" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                              <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={generalForm.control}
                    name="storeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.settings.storeAddress')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Endereço completo da loja" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormLabel>{t('admin.settings.storeLogo')}</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer">
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4 text-sm text-muted-foreground">
                        Arraste e solte arquivos aqui ou clique para fazer upload
                      </div>
                      <Input type="file" className="hidden" />
                    </div>
                  </div>
                  
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {t('admin.settings.save')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Configurações de Envio */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <CardTitle>{t('admin.settings.shipping')}</CardTitle>
              </div>
              <CardDescription>
                Configure as opções de envio para sua loja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Configurações de Envio</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esta seção está em desenvolvimento. Em breve você poderá configurar métodos de envio,
                  custos, limites para frete grátis e muito mais.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled>
                <Save className="mr-2 h-4 w-4" />
                {t('admin.settings.save')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Configurações de Pagamento */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>{t('admin.settings.payment')}</CardTitle>
              </div>
              <CardDescription>
                Configure os métodos de pagamento disponíveis na sua loja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Configurações de Pagamento</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esta seção está em desenvolvimento. Em breve você poderá configurar gateways de pagamento,
                  métodos aceitos e opções de parcelamento.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled>
                <Save className="mr-2 h-4 w-4" />
                {t('admin.settings.save')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Configurações de Impostos */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BadgePercent className="h-5 w-5" />
                <CardTitle>{t('admin.settings.tax')}</CardTitle>
              </div>
              <CardDescription>
                Configure os impostos e taxas aplicados aos produtos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <BadgePercent className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Configurações de Impostos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esta seção está em desenvolvimento. Em breve você poderá configurar taxas, impostos por região,
                  e regras fiscais.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled>
                <Save className="mr-2 h-4 w-4" />
                {t('admin.settings.save')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Configurações de Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <CardTitle>{t('admin.settings.email')}</CardTitle>
              </div>
              <CardDescription>
                Configure notificações por email e modelos de mensagens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Configurações de Email</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esta seção está em desenvolvimento. Em breve você poderá configurar emails transacionais,
                  modelos de emails e notificações.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled>
                <Save className="mr-2 h-4 w-4" />
                {t('admin.settings.save')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Configurações de Usuários */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>{t('admin.settings.users')}</CardTitle>
              </div>
              <CardDescription>
                Gerencie usuários do painel administrativo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Gestão de Usuários</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esta seção está em desenvolvimento. Em breve você poderá gerenciar usuários administradores,
                  permissões e funções.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled>
                <Save className="mr-2 h-4 w-4" />
                {t('admin.settings.save')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
