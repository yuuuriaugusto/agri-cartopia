
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  ShoppingBag, 
  Truck, 
  Settings, 
  Home, 
  Leaf,
  Droplet
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) => {
  // Map of category names to icons
  const categoryIcons: Record<string, React.ReactNode> = {
    'farm-machinery': <Tractor className="h-5 w-5" />,
    'vehicles': <Truck className="h-5 w-5" />,
    'implements': <ShoppingBag className="h-5 w-5" />,
    'irrigation': <Droplet className="h-5 w-5" />,
    'all': <Home className="h-5 w-5" />,
  };

  // Function to get human-readable category name
  const getCategoryLabel = (category: string) => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-background border-b sticky top-16 z-30">
      <div className="container py-2">
        <div className="flex overflow-x-auto gap-1 no-scrollbar">
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors",
              activeCategory === '' 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-secondary"
            )}
            onClick={() => onSelectCategory('')}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">All Products</span>
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors",
                activeCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary"
              )}
              onClick={() => onSelectCategory(category)}
            >
              {categoryIcons[category] || <Settings className="h-5 w-5" />}
              <span className="font-medium">{getCategoryLabel(category)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
