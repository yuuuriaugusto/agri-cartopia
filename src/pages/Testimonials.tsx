
import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { capitalizeWords } from '@/lib/utils';

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For this demo, using mock data
    const mockTestimonials: Testimonial[] = [
      {
        id: '1',
        name: 'John Farmer',
        company: 'Green Valley Farms',
        rating: 5,
        content: 'AgriCartopia provided us with the highest quality agricultural machinery. Their tractors have significantly improved our farm productivity and reduced maintenance costs.',
        photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80',
        date: '2025-03-15'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        company: 'Sunshine Organic Produce',
        rating: 4,
        content: 'We\'ve been using their irrigation systems for two growing seasons now. The customer service is excellent, and the equipment is durable and efficient.',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&h=80',
        date: '2025-02-22'
      },
      {
        id: '3',
        name: 'Miguel Rodriguez',
        company: 'Rodriguez Family Vineyards',
        rating: 5,
        content: 'The specialized harvesting equipment we purchased has revolutionized our grape collection process. The precision and gentleness of the machinery ensures our premium grapes remain intact.',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80',
        date: '2025-01-30'
      },
      {
        id: '4',
        name: 'Emma Williams',
        company: 'Heartland Crop Solutions',
        rating: 5,
        content: 'As agricultural consultants, we recommend AgriCartopia to all our clients. Their wide range of products and competitive pricing make them the go-to source for farm equipment.',
        date: '2024-12-15'
      },
      {
        id: '5',
        name: 'David Chen',
        company: 'Chen Hydroponics',
        rating: 4,
        content: 'Their specialized equipment for controlled environment agriculture has been instrumental in scaling our hydroponic operations. Reliable products backed by knowledgeable support.',
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
        className={index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
            Customer <span className="text-primary">Testimonials</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear what our customers have to say about their experience with AgriCartopia's products and services.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden border-muted hover:shadow-md transition-shadow duration-200">
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
                        <p className="pl-5 italic text-gray-700">{testimonial.content}</p>
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
          <h2 className="text-2xl md:text-3xl font-serif mb-4">Share Your Experience</h2>
          <p className="text-muted-foreground mb-6">
            We value your feedback. If you'd like to share your experience with our products,
            please contact our customer service team.
          </p>
          <a 
            href="mailto:testimonials@agricartopia.com" 
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Submit Your Testimonial
          </a>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
