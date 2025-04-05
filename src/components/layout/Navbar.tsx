
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, Tractor, Search, User, Heart, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Farm Machinery', path: '/products?category=farm-machinery' },
    { name: 'Vehicles', path: '/products?category=vehicles' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-sm shadow-sm py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full md:hidden transition-colors",
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary-foreground"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 font-serif text-xl font-semibold"
          >
            <Tractor className="h-6 w-6 text-primary" />
            <span className={cn(
              "transition-colors duration-300",
              isScrolled ? "text-foreground" : "text-white text-shadow"
            )}>
              Agri<span className="text-primary">Cartopia</span>
            </span>
          </Link>
        </div>

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
                    ? "text-foreground hover:text-primary" 
                    : "text-white hover:text-primary-foreground"
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
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary-foreground"
            )}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-colors",
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary-foreground"
            )}
            aria-label="User account"
          >
            <User className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-colors hidden sm:flex",
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary-foreground"
            )}
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-colors hidden sm:flex",
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary-foreground"
            )}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full transition-colors relative",
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary-foreground"
              )}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                0
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out transform pt-16",
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
                    : "hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-4" />
            <Link 
              to="/account" 
              className="px-4 py-3 text-lg font-medium rounded-md hover:bg-muted flex items-center gap-3"
            >
              <User className="h-5 w-5" />
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
