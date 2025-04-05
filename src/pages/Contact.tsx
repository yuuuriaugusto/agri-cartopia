
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: t('contact.form.successTitle'),
        description: t('contact.form.successMessage'),
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              {t('contact.title')} <span className="text-primary">{t('contact.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            {[
              { icon: MapPin, title: t('contact.address.title'), content: t('contact.address.content') },
              { icon: Phone, title: t('contact.phone.title'), content: '+1 (555) 123-4567' },
              { icon: Mail, title: t('contact.email.title'), content: 'info@agricartopia.com' },
              { icon: Clock, title: t('contact.hours.title'), content: t('contact.hours.content') }
            ].map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-serif mb-6">{t('contact.form.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">{t('contact.form.nameLabel')}</label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.namePlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">{t('contact.form.emailLabel')}</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.form.emailPlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">{t('contact.form.subjectLabel')}</label>
                  <Input 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">{t('contact.form.messageLabel')}</label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {t('contact.form.submitting')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {t('contact.form.submit')}
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* Map */}
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215150211147!2d-73.99753308459501!3d40.754988879326905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2584f9e883209%3A0x70a17be721127c11!2sTimes%20Square!5m2!1f0!2f0" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title={t('contact.map.title')}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
