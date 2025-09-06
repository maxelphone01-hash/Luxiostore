import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Shield, CheckCircle, Users } from "lucide-react";
import { auth } from "../lib/firebase";
import { useCart } from "../hooks/use-cart";
import { useLanguage } from "../hooks/use-language";
import { createOrder } from "../lib/orders";
import { toast } from "@/hooks/use-toast";
import { CustomerInfo, Product } from "../types";
import productsData from "../data/products.json";
import AuthModal from "../components/auth-modal";
import { signInWithGoogle } from "../lib/firebase";

export default function Checkout() {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Record<string, Product>>({});
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    phone: ""
  });
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();
  const { cart, clearCart, total } = useCart(allProducts);

  // Flatten products from categories
  useEffect(() => {
    const products: Record<string, Product> = {};
    Object.values(productsData).forEach((categoryProducts) => {
      categoryProducts.forEach((product) => {
        products[product.id] = product;
      });
    });
    setAllProducts(products);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user && user.email) {
        setCustomerInfo(prev => ({
          ...prev,
          email: user.email!
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      setLocation('/');
    }
  }, [cart, setLocation]);

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour continuer",
        variant: "destructive"
      });
      setAuthModalOpen(true);
      return;
    }

    // Validate form
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !customerInfo[field as keyof CustomerInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Create order
    const order = createOrder(cart, allProducts, customerInfo);
    
    // Simulate MaxelPay redirect
    toast({
      title: "Redirection vers MaxelPay",
      description: `Commande ${order.id} créée. Redirection vers le paiement sécurisé...`
    });

    // Clear cart after creating order
    clearCart();
    
    // Simulate payment result (in real app, this would come from MaxelPay callback)
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      if (success) {
        toast({
          title: "Paiement réussi !",
          description: `Commande ${order.id} confirmée`
        });
        // In real app, this would be handled by MaxelPay callback
        // updateOrderStatus(order.id, 'paid');
      } else {
        toast({
          title: "Paiement échoué",
          description: "Veuillez réessayer",
          variant: "destructive"
        });
      }
      setLocation('/');
    }, 2000);
  };

  const cartItems = cart.map(item => ({
    ...item,
    product: allProducts[item.id]
  })).filter(item => item.product);

  return (
    <div className="min-h-screen bg-background" data-testid="checkout-page">
      {/* Header */}
      <div className="border-b border-border py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">Finaliser la commande</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 checkout-mobile">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Authentication Status */}
            {!user && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">Connexion requise</h3>
                      <p className="text-sm text-muted-foreground">
                        Connectez-vous pour finaliser votre commande
                      </p>
                    </div>
                    <Button onClick={() => setAuthModalOpen(true)}>
                      Se connecter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      data-testid="input-firstname"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                      data-testid="input-lastname"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!!user}
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    data-testid="input-address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      data-testid="input-city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays *</Label>
                    <Input
                      id="country"
                      value={customerInfo.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      required
                      data-testid="input-country"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    data-testid="input-phone"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Security Section */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                  <Shield className="h-5 w-5 mr-2" />
                  Paiement sécurisé – Vos avantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Argent protégé jusqu'à la réception</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Transactions simples et sûres</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Assistance disponible</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Confiance et sérénité pour tous</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4" data-testid={`checkout-item-${item.id}`}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.product.price}€ × {item.quantity}
                        </p>
                      </div>
                      <div className="font-bold">
                        {item.product.price * item.quantity}€
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span data-testid="checkout-total">{total}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-primary rounded-lg p-4 bg-primary/10">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">MaxelPay</h4>
                      <p className="text-sm text-muted-foreground">
                        Cartes bancaires & virements
                      </p>
                    </div>
                    <Badge variant="default">ACTIF</Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 opacity-60">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold text-muted-foreground">PayU</h4>
                      <p className="text-sm text-muted-foreground">
                        Solutions de paiement
                      </p>
                    </div>
                    <Badge variant="outline">BIENTÔT</Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 opacity-60">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold text-muted-foreground">Transak</h4>
                      <p className="text-sm text-muted-foreground">
                        Fiat vers crypto
                      </p>
                    </div>
                    <Badge variant="outline">BIENTÔT</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">15,847</div>
                    <div className="text-sm text-muted-foreground">Clients satisfaits</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">23,156</div>
                    <div className="text-sm text-muted-foreground">Commandes livrées</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              className="w-full h-12 text-lg"
              data-testid="button-pay"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Payer avec MaxelPay - {total}€
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        user={user}
        t={t}
      />
    </div>
  );
}