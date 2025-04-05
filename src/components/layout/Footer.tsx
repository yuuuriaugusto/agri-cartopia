
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tractor, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-earth-950 text-white">
      <div className="container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Tractor className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-semibold">
                Agri<span className="text-primary">Cartopia</span>
              </span>
            </Link>
            <p className="text-earth-100/80 text-sm">
              {t('footer.companyInfo')}
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-earth-100/80 hover:text-white">
                <Facebook size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-earth-100/80 hover:text-white">
                <Instagram size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-earth-100/80 hover:text-white">
                <Twitter size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-earth-100/80 hover:text-white">
                <Youtube size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {[
                { label: t('common.products'), path: '/products' },
                { label: t('common.about'), path: '/about' },
                { label: t('common.contact'), path: '/contact' },
                { label: t('common.testimonials'), path: '/testimonials' },
                { label: 'FAQ', path: '/faq' },
                { label: t('common.termsAndConditions'), path: '/terms' },
                { label: t('common.privacyPolicy'), path: '/privacy' }
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.path}
                    className="text-earth-100/80 hover:text-white transition-colors hover-underline text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('footer.productCategories')}</h3>
            <ul className="space-y-2">
              {[
                'Tractors', 
                'Harvesters', 
                'Farming Vehicles', 
                'Agricultural Tools', 
                'Irrigation Systems', 
                'Spare Parts', 
                'Accessories'
              ].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/products?category=${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-earth-100/80 hover:text-white transition-colors hover-underline text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('footer.stayUpdated')}</h3>
            <p className="text-earth-100/80 text-sm mb-4">
              {t('footer.newsletterText')}
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder')} 
                  className="rounded-r-none bg-earth-900 border-earth-800 text-white placeholder:text-earth-100/50"
                />
                <Button type="submit" className="rounded-l-none">
                  {t('common.subscribe')}
                </Button>
              </div>
            </form>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-earth-100/80 text-sm">
                <Mail size={16} />
                <span>info@agricartopia.com</span>
              </div>
              <div className="flex items-center gap-2 text-earth-100/80 text-sm">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-earth-100/80 text-sm">
                <MapPin size={16} />
                <span>{t('contact.address.content')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-earth-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-earth-100/60">
            {t('common.copyright')}
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-earth-100/60 hover:text-white transition-colors">
              {t('common.termsAndConditions')}
            </Link>
            <Link to="/privacy" className="text-sm text-earth-100/60 hover:text-white transition-colors">
              {t('common.privacyPolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
