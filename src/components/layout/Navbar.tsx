
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Tractor, 
  Search, 
  User, 
  Sun, 
  Moon, 
  Globe 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();

  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/produtos');
    }
  };

  const handleUserIconClick = () => {
    navigate('/login');
  };

  const navLinks = [
    { name: t('common.home'), path: '/' },
    { name: t('common.products'), path: '/produtos' },
    { name: t('common.farmMachinery'), path: '/produtos?category=farm-machinery' },
    { name: t('common.vehicles'), path: '/produtos?category=vehicles' },
    { name: t('common.testimonials'), path: '/depoimentos' },
    { name: t('common.about'), path: '/sobre' },
    { name: t('common.contact'), path: '/contato' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-serif text-xl font-semibold"
        >
          <Tractor className="h-6 w-6 text-primary" />
          <span className={cn(
            "transition-colors duration-300",
            isScrolled 
              ? "text-foreground dark:text-white" 
              : "text-white text-shadow dark:text-white"
          )}>
            Agri<span className="text-primary">Cartopia</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover-underline",
                link.path === location.pathname 
                  ? "text-primary" 
                  : isScrolled 
                    ? "text-foreground dark:text-white hover:text-primary" 
                    : "text-white hover:text-primary-foreground dark:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-colors",
              isScrolled 
                ? "text-foreground dark:text-white hover:text-primary" 
                : "text-white hover:text-primary-foreground dark:text-white"
            )}
            aria-label={t('common.search')}
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full transition-colors",
                  isScrolled 
                    ? "text-foreground dark:text-white hover:text-primary" 
                    : "text-white hover:text-primary-foreground dark:text-white"
                )}
                aria-label={t('common.language')}
              >
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setLanguage('pt-BR')}
                className={language === 'pt-BR' ? "bg-muted" : ""}
              >
                Português (BR)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('en')}
                className={language === 'en' ? "bg-muted" : ""}
              >
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme Switcher */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-colors",
              isScrolled 
                ? "text-foreground dark:text-white hover:text-primary" 
                : "text-white hover:text-primary-foreground dark:text-white"
            )}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={t('common.theme')}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-colors",
              isScrolled 
                ? "text-foreground dark:text-white hover:text-primary" 
                : "text-white hover:text-primary-foreground dark:text-white"
            )}
            aria-label={t('common.account')}
            onClick={handleUserIconClick}
          >
            <User className="h-5 w-5" />
          </Button>
          
          <Link to="/carrinho">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full transition-colors relative",
                isScrolled 
                  ? "text-foreground dark:text-white hover:text-primary" 
                  : "text-white hover:text-primary-foreground dark:text-white"
              )}
              aria-label={t('common.cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                0
              </span>
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full md:hidden transition-colors",
              isScrolled 
                ? "text-foreground dark:text-white hover:text-primary" 
                : "text-white hover:text-primary-foreground dark:text-white"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('common.close') : t('common.menu')}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 bg-background dark:bg-gray-900 z-40 transition-transform duration-300 ease-in-out transform pt-16",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <nav className="container flex flex-col space-y-4 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-3 text-lg font-medium rounded-md transition-colors",
                  link.path === location.pathname
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted dark:hover:bg-gray-800"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border dark:bg-gray-700 my-4" />
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-lg font-medium">{t('common.language')}</span>
              <div className="flex gap-2">
                <Button 
                  variant={language === 'pt-BR' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setLanguage('pt-BR')}
                >
                  PT
                </Button>
                <Button 
                  variant={language === 'en' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  EN
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-lg font-medium">{t('common.theme')}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
            <Link 
              to="/login" 
              className="px-4 py-3 text-lg font-medium rounded-md hover:bg-muted dark:hover:bg-gray-800 flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              {t('common.account')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
