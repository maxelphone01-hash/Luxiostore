import { Truck, Shield, Percent } from "lucide-react";

interface HeroProps {
  t: (key: string) => string;
}

export default function Hero({ t }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-background via-secondary to-background py-20" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 hero-mobile" data-testid="hero-title">
            <span className="gradient-gold bg-clip-text text-transparent">LUXIO</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8" data-testid="hero-subtitle">
            {t('hero.tagline')}
          </p>
          <p className="text-lg text-foreground mb-12 max-w-3xl mx-auto" data-testid="hero-description">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center text-accent" data-testid="feature-shipping">
              <Truck className="mr-2 h-5 w-5" />
              <span>{t('hero.free_shipping')}</span>
            </div>
            <div className="flex items-center text-accent" data-testid="feature-warranty">
              <Shield className="mr-2 h-5 w-5" />
              <span>{t('hero.premium_warranty')}</span>
            </div>
            <div className="flex items-center text-accent" data-testid="feature-discount">
              <Percent className="mr-2 h-5 w-5" />
              <span>{t('hero.up_to_discount')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
