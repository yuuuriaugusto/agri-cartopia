
import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import Layout from '@/components/layout/Layout';

// Types
interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number;
  content: string;
  photoUrl?: string;
  date: string;
}

const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For this demo, using mock data
    const mockTestimonials: Testimonial[] = [
      {
        id: '1',
        name: 'João Agricultor',
        company: 'Fazenda Vale Verde',
        rating: 5,
        content: 'A AgriCartopia forneceu maquinário agrícola da mais alta qualidade. Seus tratores melhoraram significativamente a produtividade da nossa fazenda e reduziram os custos de manutenção.',
        photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80',
        date: '2025-03-15'
      },
      {
        id: '2',
        name: 'Sara Pereira',
        company: 'Produção Orgânica Raio de Sol',
        rating: 4,
        content: 'Estamos usando seus sistemas de irrigação há duas safras. O atendimento ao cliente é excelente, e os equipamentos são duráveis e eficientes.',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&h=80',
        date: '2025-02-22'
      },
      {
        id: '3',
        name: 'Miguel Rodriguez',
        company: 'Vinícola Família Rodriguez',
        rating: 5,
        content: 'O equipamento especializado de colheita que compramos revolucionou nosso processo de coleta de uvas. A precisão e delicadeza da máquina garantem que nossas uvas premium permaneçam intactas.',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80',
        date: '2025-01-30'
      },
      {
        id: '4',
        name: 'Amanda Oliveira',
        company: 'Soluções Agrícolas Central',
        rating: 5,
        content: 'Como consultores agrícolas, recomendamos a AgriCartopia para todos os nossos clientes. Sua ampla gama de produtos e preços competitivos os tornam a fonte preferida para equipamentos agrícolas.',
        date: '2024-12-15'
      },
      {
        id: '5',
        name: 'Davi Costa',
        company: 'Hidroponia Costa',
        rating: 4,
        content: 'Seus equipamentos especializados para agricultura em ambiente controlado foram fundamentais para expandir nossas operações hidropônicas. Produtos confiáveis apoiados por suporte técnico qualificado.',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80',
        date: '2024-11-08'
      }
    ];

    setTestimonials(mockTestimonials);
    setIsLoading(false);
  }, []);

  // Render star ratings
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} 
      />
    ));
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              {t('testimonials.title')} <span className="text-primary">{t('testimonials.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="overflow-hidden border-muted hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/10">
                        {testimonial.photoUrl ? (
                          <AvatarImage src={testimonial.photoUrl} alt={testimonial.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{testimonial.name}</h3>
                            <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                          </div>
                          <div className="flex">{renderRating(testimonial.rating)}</div>
                        </div>
                        <div className="mt-4 relative">
                          <Quote className="absolute -left-1 -top-1 h-6 w-6 text-primary/20 rotate-180" />
                          <p className="pl-5 italic text-gray-700 dark:text-gray-300">{testimonial.content}</p>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground text-right">
                          {formatDate(testimonial.date)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Separator className="my-16" />

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">{t('testimonials.submitYours')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('testimonials.submitText')}
            </p>
            <a 
              href="mailto:testimonials@agricartopia.com" 
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {t('testimonials.submitButton')}
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Testimonials;
