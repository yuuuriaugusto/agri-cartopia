
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "@/hooks/use-translation";
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";

// Definição do esquema de categoria usando Zod
const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  slug: z.string().min(2, { message: "Slug deve ter pelo menos 2 caracteres" }),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// Dados de exemplo para categorias
const mockCategories = [
  { id: "1", name: "Maquinário Agrícola", slug: "maquinario-agricola", description: "Equipamentos e máquinas para agricultura", parentId: null, products: 15 },
  { id: "2", name: "Tratores", slug: "tratores", description: "Tratores de diversos tamanhos e potências", parentId: "1", products: 8 },
  { id: "3", name: "Colheitadeiras", slug: "colheitadeiras", description: "Máquinas para colheita", parentId: "1", products: 5 },
  { id: "4", name: "Veículos", slug: "veiculos", description: "Veículos para transporte agrícola", parentId: null, products: 10 },
  { id: "5", name: "Caminhões", slug: "caminhoes", description: "Caminhões para transporte de carga", parentId: "4", products: 6 },
  { id: "6", name: "Utilitários", slug: "utilitarios", description: "Veículos utilitários para uso rural", parentId: "4", products: 4 },
  { id: "7", name: "Sistemas de Irrigação", slug: "sistemas-de-irrigacao", description: "Equipamentos para irrigação", parentId: null, products: 7 },
  { id: "8", name: "Implementos", slug: "implementos", description: "Implementos agrícolas diversos", parentId: null, products: 12 },
];

const Categories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(mockCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof mockCategories[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: undefined,
    },
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: undefined,
    },
  });

  const handleAddCategory = () => {
    form.reset();
    setIsAddDialogOpen(true);
  };

  const handleEditCategory = (category: typeof mockCategories[0]) => {
    setSelectedCategory(category);
    editForm.reset({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId || undefined,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(t('admin.categories.confirmDelete'))) {
      try {
        // Filtrar a categoria e suas subcategorias
        const updatedCategories = categories.filter(cat => cat.id !== id && cat.parentId !== id);
        setCategories(updatedCategories);
        toast.success(t('admin.categories.deleted'));
      } catch (error) {
        toast.error(t('admin.categories.deleteFailed'));
      }
    }
  };

  const onSubmitAdd = (data: CategoryFormValues) => {
    const newCategory = {
      id: Date.now().toString(),
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      parentId: data.parentId || null,
      products: 0,
    };
    
    setCategories([...categories, newCategory]);
    setIsAddDialogOpen(false);
    toast.success("Categoria adicionada com sucesso");
  };

  const onSubmitEdit = (data: CategoryFormValues) => {
    const updatedCategories = categories.map(cat => 
      cat.id === data.id 
        ? { 
            ...cat, 
            name: data.name, 
            slug: data.slug, 
            description: data.description || "", 
            parentId: data.parentId || null 
          } 
        : cat
    );
    
    setCategories(updatedCategories);
    setIsEditDialogOpen(false);
    toast.success("Categoria atualizada com sucesso");
  };

  // Função auxiliar para gerar o slug a partir do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Acompanhar mudanças no nome para gerar o slug automaticamente
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        form.setValue('slug', generateSlug(value.name || ''));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  React.useEffect(() => {
    const subscription = editForm.watch((value, { name }) => {
      if (name === 'name') {
        editForm.setValue('slug', generateSlug(value.name || ''));
      }
    });
    return () => subscription.unsubscribe();
  }, [editForm]);

  // Filtra as categorias com base na consulta de pesquisa
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formata o nome da categoria pai
  const getParentName = (parentId: string | null) => {
    if (!parentId) return "—";
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.categories.title')}</h1>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.categories.add')}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('admin.categories.search')}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.categories.name')}</TableHead>
              <TableHead>{t('admin.categories.slug')}</TableHead>
              <TableHead>{t('admin.categories.parent')}</TableHead>
              <TableHead>{t('admin.categories.products')}</TableHead>
              <TableHead className="w-[100px]">{t('admin.categories.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{getParentName(category.parentId)}</TableCell>
                  <TableCell>{category.products}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {t('admin.categories.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('admin.categories.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('admin.categories.noCategories')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para adicionar categoria */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('admin.categories.addNew')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.slug')}</FormLabel>
                    <FormControl>
                      <Input placeholder="slug-da-categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.description')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.parent')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhuma (categoria principal)</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Adicionar Categoria</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar categoria */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('admin.categories.editCategory')}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.slug')}</FormLabel>
                    <FormControl>
                      <Input placeholder="slug-da-categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.description')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.parent')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhuma (categoria principal)</SelectItem>
                        {categories
                          .filter(cat => cat.id !== selectedCategory?.id) // Evitar categoria atual como pai
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Atualizar Categoria</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
