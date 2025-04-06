
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AddToCartButton from '@/components/ui/botao-adicionar-carrinho';
import { type Product } from '@/context/ProductContext';
import { useTranslation } from '@/hooks/use-translation';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProductCard = ({ product, size = 'md', className }: ProductCardProps) => {
  const { id, name, price, images, rating, brand, isNew, discount } = product;
  const { t } = useTranslation();
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  
  const discountedPrice = discount 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(price * (1 - discount / 100))
    : null;

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl bg-white border border-border transition-all duration-300 hover:shadow-md",
        size === 'sm' ? 'max-w-[16rem]' : size === 'lg' ? 'max-w-[24rem]' : 'max-w-[20rem]',
        className
      )}
    >
      {/* Image */}
      <Link to={`/products/${id}`} className="block overflow-hidden">
        <div className={cn(
          "relative overflow-hidden",
          size === 'sm' ? 'h-40' : size === 'lg' ? 'h-64' : 'h-52'
        )}>
          <img 
            src={images[0]} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && (
              <Badge className="bg-primary text-white font-medium">New</Badge>
            )}
            {discount && (
              <Badge className="bg-destructive text-white font-medium">
                -{discount}%
              </Badge>
            )}
          </div>
          
          {/* Wishlist button */}
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-80 hover:opacity-100 transition-opacity"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className={cn(
        "p-4",
        size === 'sm' ? 'p-3' : size === 'lg' ? 'p-5' : 'p-4'
      )}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-muted-foreground">{brand}</p>
          <div className="flex items-center text-xs">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{rating}</span>
          </div>
        </div>
        
        <Link to={`/products/${id}`} className="block group-hover:text-primary transition-colors">
          <h3 className={cn(
            "font-medium line-clamp-2",
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          )}>
            {name}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            {discount ? (
              <>
                <span className="text-muted-foreground line-through text-sm">{formattedPrice}</span>
                <span className="font-semibold text-destructive">{discountedPrice}</span>
              </>
            ) : (
              <span className="font-semibold">{formattedPrice}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link to={`/products/${id}`}>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <AddToCartButton product={product} size="sm" className="h-9" showText={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
