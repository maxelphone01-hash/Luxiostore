import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

interface FooterProps {
  t: (key: string) => string;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-background border-t border-border py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-gold mb-4" data-testid="footer-logo">
              LUXIO
            </h3>
            <p className="text-muted-foreground text-sm" data-testid="footer-tagline">
              {t('hero.tagline')}
            </p>
            <p className="text-muted-foreground text-sm mt-2" data-testid="footer-description">
              Premium e-commerce pour les passionnés de technologie et de style.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-categories-title">Catégories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#smartphones" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-smartphones">{t('nav.smartphones')}</a></li>
              <li><a href="#smartwatches" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-watches">{t('nav.watches')}</a></li>
              <li><a href="#sneakers" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-fashion">{t('nav.fashion')}</a></li>
              <li><a href="#smart_home" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-home">{t('nav.home')}</a></li>
              <li><a href="#mobility" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-mobility">{t('nav.mobility')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-support-title">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-help">Centre d'aide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-shipping">Livraison</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-returns">Retours</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-warranty">Garantie</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-contact">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-social-title">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-youtube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground" data-testid="footer-copyright">
          <p>&copy; 2024 Luxio. Tous droits réservés. | Conditions d'utilisation | Politique de confidentialité</p>
        </div>
      </div>
    </footer>
  );
}
