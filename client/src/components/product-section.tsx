import { Button } from "@/components/ui/button";
import { Product } from "../types";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  backgroundColor?: string;
  onAddToCart: (productId: string) => void;
  t: (key: string) => string;
}

export default function ProductSection({ 
  title, 
  subtitle, 
  products, 
  backgroundColor = "bg-card",
  onAddToCart,
  t 
}: ProductSectionProps) {
  return (
    <section className={`py-16 ${backgroundColor}`} data-testid={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" data-testid="section-title">{title}</h2>
          <p className="text-muted-foreground" data-testid="section-subtitle">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 product-grid-mobile">
          {products.map((product) => (
            <div key={product.id} className="bg-secondary rounded-lg p-6 hover-scale product-card-mobile" data-testid={`product-card-${product.id}`}>
              <div className="relative mb-4">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                  data-testid={`product-image-${product.id}`}
                />
                <div className="absolute top-2 right-2 discount-badge text-white px-2 py-1 rounded text-sm font-semibold" data-testid={`discount-badge-${product.id}`}>
                  -{product.discount}%
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2" data-testid={`product-name-${product.id}`}>
                {product.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3" data-testid={`product-specs-${product.id}`}>
                {product.specifications.slice(0, 3).join(' • ')}
              </p>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg line-through text-muted-foreground" data-testid={`original-price-${product.id}`}>
                  {product.originalPrice}€
                </span>
                <span className="text-2xl font-bold text-primary" data-testid={`current-price-${product.id}`}>
                  {product.price}€
                </span>
              </div>
              
              {product.colors && product.colors.length > 0 && (
                <div className="flex space-x-2 mb-4" data-testid={`color-options-${product.id}`}>
                  {product.colors.slice(0, 4).map((color, index) => (
                    <div 
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-ring"
                      style={{ backgroundColor: color }}
                      data-testid={`color-option-${product.id}-${index}`}
                    />
                  ))}
                </div>
              )}
              
              <Button 
                onClick={() => onAddToCart(product.id)}
                className="w-full"
                data-testid={`add-to-cart-${product.id}`}
              >
                {t('sections.add_to_cart')}
              </Button>
            </div>
          ))}
        </div>

        {products.length > 6 && (
          <div className="text-center mt-8">
            <Button variant="secondary" data-testid="view-all-button">
              Voir tous les produits
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
