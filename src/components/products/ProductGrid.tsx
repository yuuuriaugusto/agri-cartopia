
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ThumbsUp,
  MapPin, 
  Tractor,
  Star,
  Share2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Product } from '@/context/ProductContext';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductGridItem key={product.id} product={product} />
      ))}
    </div>
  );
};

const ProductGridItem = ({ product }: { product: Product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="relative">
        <Link to={`/products/${product.id}`} className="block">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full aspect-[4/3] object-cover"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.isNew && (
            <Badge className="font-medium bg-blue-500">New</Badge>
          )}
          {product.isFeatured && (
            <Badge className="font-medium bg-amber-500">Featured</Badge>
          )}
          {product.discount > 0 && (
            <Badge className="font-medium bg-red-500">-{product.discount}%</Badge>
          )}
        </div>
        
        {/* Favorite button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={cn("h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "")} />
        </Button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            {/* Using subcategory as location since 'location' doesn't exist */}
            {product.subcategory || "Not specified"}
          </span>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/products/${product.id}`} className="group">
          <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Tractor className="h-3.5 w-3.5" />
            {product.brand}
          </span>
          {product.specs?.model && (
            <span className="flex items-center gap-1">
              Model: {product.specs.model}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t">
          <div className="font-semibold text-xl">
            {formatPrice(product.price)}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="h-8 w-8 p-0"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              asChild
              className="h-8"
            >
              <Link to={`/products/${product.id}`}>View</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

import { cn } from '@/lib/utils';
export default ProductGrid;
