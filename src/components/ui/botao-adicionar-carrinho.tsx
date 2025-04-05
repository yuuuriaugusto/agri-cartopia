
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { type Product } from '@/context/ProductContext';
import { useTranslation } from '@/hooks/use-translation';

interface AddToCartButtonProps {
  product: Product;
  size?: 'default' | 'sm' | 'lg'; // Changed 'md' to 'default' to match Button component's types
  variant?: 'default' | 'outline' | 'secondary';
  showText?: boolean;
  quantity?: number;
  className?: string;
}

const AddToCartButton = ({ 
  product, 
  size = 'default', // Changed default from 'md' to 'default'
  variant = 'default',
  showText = false,
  quantity = 1,
  className 
}: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const { t } = useTranslation();
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price,
      image: product.images[0],
    });
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      className={cn(
        "transition-all duration-300 group",
        className
      )}
    >
      <ShoppingCart className={cn(
        "h-4 w-4 transition-transform group-hover:scale-110",
        showText ? "mr-2" : ""
      )} />
      {showText && t('common.cart')}
    </Button>
  );
};

export default AddToCartButton;
