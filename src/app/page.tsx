import { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ZonesSection } from '@/components/sections/ZonesSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: {
    canonical: siteConfig.urls.website,
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Au-dessus de la ligne de flottaison */}
      <HeroSection />
      
      {/* Stats - Preuves sociales immédiates */}
      <StatsSection />
      
      {/* Services - Présentation des prestations */}
      <ServicesSection />
      
      {/* Avantages - Pourquoi nous choisir */}
      <BenefitsSection />
      
      {/* Témoignages clients */}
      <TestimonialsSection />
      
      {/* Zones d'intervention */}
      <ZonesSection />
      
      {/* FAQ - SEO et réassurance */}
      <FAQSection />
      
      {/* CTA final */}
      <CTASection />
    </>
  );
}
