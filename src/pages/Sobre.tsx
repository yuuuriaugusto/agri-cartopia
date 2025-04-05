
import { Tractor, Award, Users, Clock, Leaf } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import Layout from '@/components/layout/Layout';

const About = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              {t('about.title')} <span className="text-primary">{t('about.titleHighlight')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Our Story Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-serif mb-6">{t('about.ourStory.title')}</h2>
              <p className="mb-4">
                {t('about.ourStory.paragraph1')}
              </p>
              <p className="mb-4">
                {t('about.ourStory.paragraph2')}
              </p>
              <p>
                {t('about.ourStory.paragraph3')}
              </p>
            </div>
            <div className="relative">
              <div className="bg-earth-100 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt={t('about.ourStory.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-4 rounded-lg shadow-lg">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-sm">{t('about.ourStory.yearsExperience')}</p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-serif text-center mb-12">{t('about.ourValues.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Leaf, title: t('about.ourValues.sustainable.title'), description: t('about.ourValues.sustainable.description') },
                { icon: Award, title: t('about.ourValues.quality.title'), description: t('about.ourValues.quality.description') },
                { icon: Users, title: t('about.ourValues.community.title'), description: t('about.ourValues.community.description') },
                { icon: Clock, title: t('about.ourValues.innovation.title'), description: t('about.ourValues.innovation.description') }
              ].map((value, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-serif text-center mb-12">{t('about.ourTeam.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Carlos Silva', role: t('about.ourTeam.roles.ceo'), image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80' },
                { name: 'Ana Pereira', role: t('about.ourTeam.roles.cto'), image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80' },
                { name: 'Lucas Santos', role: t('about.ourTeam.roles.salesDirector'), image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80' }
              ].map((member, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
                  <div className="mb-4 mx-auto w-24 h-24 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
