
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { productService, CreateProductData } from '@/services/ProductService';
import { Product } from '@/context/ProductContext';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: () => void;
}

type FormValues = Omit<CreateProductData, 'specs'> & {
  specs: string; // JSON string for simplification
};

const ProductForm = ({ product, onSubmit }: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: product ? {
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      images: product.images,
      description: product.description,
      features: product.features,
      specs: JSON.stringify(product.specs, null, 2),
      stock: product.stock,
      brand: product.brand,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      discount: product.discount || 0
    } : {
      name: '',
      category: '',
      subcategory: '',
      price: 0,
      images: [''],
      description: '',
      features: [''],
      specs: '{}',
      stock: 0,
      brand: '',
      isNew: false,
      isFeatured: false,
      discount: 0
    }
  });

  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Parse specs from string to object
      let specs = {};
      try {
        specs = JSON.parse(data.specs);
      } catch (e) {
        toast.error('Invalid specifications format');
        return;
      }
      
      // Filter out empty features and image URLs
      const features = data.features.filter(feature => feature.trim() !== '');
      const images = data.images.filter(img => img.trim() !== '');
      
      const productData = {
        ...data,
        features,
        images,
        specs
      };
      
      if (product) {
        // Update existing product
        await productService.updateProduct(product.id, productData);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await productService.createProduct(productData);
        toast.success('Product created successfully');
      }
      
      onSubmit();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const addImageField = () => {
    const currentImages = form.getValues().images || [];
    form.setValue('images', [...currentImages, '']);
  };

  const removeImageField = (index: number) => {
    const currentImages = form.getValues().images || [];
    if (currentImages.length > 1) {
      form.setValue(
        'images', 
        currentImages.filter((_, i) => i !== index)
      );
    }
  };

  const addFeatureField = () => {
    const currentFeatures = form.getValues().features || [];
    form.setValue('features', [...currentFeatures, '']);
  };

  const removeFeatureField = (index: number) => {
    const currentFeatures = form.getValues().features || [];
    if (currentFeatures.length > 1) {
      form.setValue(
        'features', 
        currentFeatures.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter product name" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Category" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Subcategory" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    placeholder="0.00" 
                    min="0" 
                    step="0.01"
                    required 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    placeholder="0" 
                    min="0" 
                    step="1"
                    required 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Brand name" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    placeholder="0" 
                    min="0" 
                    max="100" 
                    step="1" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel>Mark as New</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <FormLabel>Featured Product</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter product description" 
                  className="h-24"
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label>Images (URLs)</Label>
          {form.watch('images')?.map((_, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <FormField
                control={form.control}
                name={`images.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Image URL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={() => removeImageField(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            className="mt-2" 
            onClick={addImageField}
          >
            Add Image
          </Button>
        </div>

        <div>
          <Label>Features</Label>
          {form.watch('features')?.map((_, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <FormField
                control={form.control}
                name={`features.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Feature" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={() => removeFeatureField(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            className="mt-2" 
            onClick={addFeatureField}
          >
            Add Feature
          </Button>
        </div>

        <FormField
          control={form.control}
          name="specs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specifications (JSON)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder='{"key": "value"}' 
                  className="h-24 font-mono text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
