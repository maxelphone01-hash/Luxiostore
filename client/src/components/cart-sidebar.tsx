import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useLocation } from "wouter";
import { CartItem, Product } from "../types";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Record<string, Product>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  total: number;
  t: (key: string) => string;
}

export default function CartSidebar({ 
  isOpen, 
  onClose, 
  cart, 
  products, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  total,
  t 
}: CartSidebarProps) {
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert(t('cart.empty'));
      return;
    }
    
    onClose();
    setLocation('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96 overflow-y-auto" data-testid="cart-sidebar">
        <SheetHeader>
          <SheetTitle className="flex items-center" data-testid="cart-title">
            <ShoppingCart className="mr-2 h-5 w-5" />
            {t('nav.cart')}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-8" data-testid="cart-empty">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('cart.empty')}</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="cart-items">
              {cart.map((item) => {
                const product = products[item.id];
                if (!product) return null;
                
                const itemTotal = product.price * item.quantity;
                
                return (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                      data-testid={`cart-item-image-${item.id}`}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold" data-testid={`cart-item-name-${item.id}`}>
                        {product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`cart-item-price-${item.id}`}>
                        {product.price}€ x {item.quantity}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" data-testid={`cart-item-total-${item.id}`}>
                        {itemTotal}€
                      </div>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-red-400 hover:text-red-300"
                        data-testid={`remove-item-${item.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {cart.length > 0 && (
            <div className="border-t border-border pt-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">{t('cart.total')}</span>
                <span className="text-2xl font-bold text-primary" data-testid="cart-total">
                  {total}€
                </span>
              </div>
              <Button 
                onClick={handleCheckout}
                className="w-full"
                data-testid="checkout-button"
              >
                {t('cart.checkout')}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
