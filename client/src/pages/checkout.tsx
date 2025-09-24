import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, CreditCard, Shield, CheckCircle, Users, Gift, Bitcoin, Copy, X, Plus, Trash2 } from "lucide-react";
import { auth } from "../lib/firebase";
import { useCart } from "../hooks/use-cart";
import { useLanguage } from "../hooks/use-language";
import { createOrder } from "../lib/orders";
import { toast } from "@/hooks/use-toast";
import { CustomerInfo, Product } from "../types";
import productsData from "../data/products.json";
import AuthModal from "../components/auth-modal";
import { signInWithGoogle } from "../lib/firebase";

type PaymentMethod = 'maxelpay' | 'hodl' | 'dundle';

interface VoucherData {
  code: string;
  amount: string;
}

export default function Checkout() {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Record<string, Product>>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('maxelpay');
  const [hodlModalOpen, setHodlModalOpen] = useState(false);
  const [dundleModalOpen, setDundleModalOpen] = useState(false);
  const [isNovice, setIsNovice] = useState<boolean | null>(null);
  const [vouchers, setVouchers] = useState<VoucherData[]>([{ code: '', amount: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Redirect if cart is empty after initial load
  useEffect(() => {
    if (cart.length === 0 && allProducts && Object.keys(allProducts).length > 0) {
      console.log('Checkout: redirecting to home, cart is empty');
      setLocation('/');
    }
  }, [cart, setLocation, allProducts]);

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyBitcoinAddress = async () => {
    const address = 'bc1qxt5rk6nsawuncf5z0vwq6rdtvvjq6pu3ssh9yl';
    try {
      await navigator.clipboard.writeText(address);
      toast({ title: 'Adresse copiée!', description: 'Adresse Bitcoin copiée dans le presse-papier' });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({ title: 'Adresse copiée!', description: 'Adresse Bitcoin copiée dans le presse-papier' });
    }
  };

  const addVoucher = () => {
    setVouchers([...vouchers, { code: '', amount: '' }]);
  };

  const removeVoucher = (index: number) => {
    if (vouchers.length > 1) {
      setVouchers(vouchers.filter((_, i) => i !== index));
    }
  };

  const updateVoucher = (index: number, field: keyof VoucherData, value: string) => {
    const updated = [...vouchers];
    updated[index][field] = value;
    setVouchers(updated);
  };

  const calculateVouchersTotal = () => {
    return vouchers.reduce((sum, voucher) => {
      const amount = parseFloat(voucher.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const submitVouchers = async () => {
    if (isSubmitting) return;
    
    const validVouchers = vouchers.filter(v => v.code.trim() && v.amount.trim());
    if (validVouchers.length === 0) {
      toast({ title: 'Erreur', description: 'Veuillez saisir au moins un voucher valide', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate sending to email (replace with real Formspree endpoint)
      const emailData = {
        email: customerInfo.email,
        vouchers: validVouchers,
        total: calculateVouchersTotal(),
        orderTotal: total,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        _subject: `Nouveaux vouchers Dundle - ${customerInfo.email}`
      };
      
      // For now, just log the data and show success
      console.log('Sending voucher data:', emailData);
      
      toast({ 
        title: 'Succès!', 
        description: 'Vos vouchers ont été envoyés avec succès. Nous les vérifions et vous recevrez une confirmation rapidement.' 
      });
      setDundleModalOpen(false);
      setVouchers([{ code: '', amount: '' }]);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer les vouchers. Veuillez réessayer.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
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

    // Handle different payment methods
    if (selectedPaymentMethod === 'hodl') {
      setHodlModalOpen(true);
      return;
    }
    
    if (selectedPaymentMethod === 'dundle') {
      setDundleModalOpen(true);
      return;
    }
    
    // MaxelPay processing
    const order = createOrder(cart, allProducts, customerInfo);
    toast({
      title: "Redirection vers MaxelPay",
      description: `Commande ${order.id} créée. Redirection vers le paiement sécurisé...`
    });
    clearCart();
    
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        toast({
          title: "Paiement réussi !",
          description: `Commande ${order.id} confirmée`
        });
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

  const handleHodlPaymentConfirm = () => {
    console.log('Hodl Hodl payment confirmed');
    try {
      const order = createOrder(cart, allProducts, customerInfo);
      clearCart();
      toast({ 
        title: "Commande confirmée!", 
        description: `Votre commande ${order.id} a été enregistrée. Nous confirmerons la réception du paiement Bitcoin.` 
      });
      setHodlModalOpen(false);
      setTimeout(() => {
        setLocation('/account');
      }, 2000);
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue lors de la création de votre commande.", variant: "destructive" });
    }
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
              <CardContent>
                <RadioGroup value={selectedPaymentMethod} onValueChange={(value: PaymentMethod) => setSelectedPaymentMethod(value)} className="space-y-4">
                  <div className="space-y-3">
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPaymentMethod === 'maxelpay' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                      <label htmlFor="maxelpay" className="cursor-pointer w-full block">
                        <RadioGroupItem value="maxelpay" id="maxelpay" className="sr-only" />
                        <div className="flex items-center space-x-3">
                          <CreditCard className={`h-6 w-6 ${selectedPaymentMethod === 'maxelpay' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <h4 className="font-semibold">MaxelPay</h4>
                            <p className="text-sm text-muted-foreground">
                              Cartes bancaires & virements
                            </p>
                          </div>
                          {selectedPaymentMethod === 'maxelpay' && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </label>
                    </div>

                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPaymentMethod === 'dundle' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-border hover:border-green-300'}`}>
                      <label htmlFor="dundle" className="cursor-pointer w-full block">
                        <RadioGroupItem value="dundle" id="dundle" className="sr-only" />
                        <div className="flex items-center space-x-3">
                          <Gift className={`h-6 w-6 ${selectedPaymentMethod === 'dundle' ? 'text-green-600' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <h4 className={`font-semibold ${selectedPaymentMethod === 'dundle' ? 'text-green-800 dark:text-green-200' : ''}`}>Dundle</h4>
                            <p className={`text-sm ${selectedPaymentMethod === 'dundle' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                              Cartes cadeaux & vouchers
                            </p>
                          </div>
                          {selectedPaymentMethod === 'dundle' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">ACTIF</Badge>
                          )}
                        </div>
                      </label>
                    </div>

                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPaymentMethod === 'hodl' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950' : 'border-border hover:border-orange-300'}`}>
                      <label htmlFor="hodl" className="cursor-pointer w-full block">
                        <RadioGroupItem value="hodl" id="hodl" className="sr-only" />
                        <div className="flex items-center space-x-3">
                          <Bitcoin className={`h-6 w-6 ${selectedPaymentMethod === 'hodl' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <h4 className={`font-semibold ${selectedPaymentMethod === 'hodl' ? 'text-orange-800 dark:text-orange-200' : ''}`}>Hodl Hodl</h4>
                            <p className={`text-sm ${selectedPaymentMethod === 'hodl' ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}>
                              Achat Bitcoin et paiement direct
                            </p>
                          </div>
                          {selectedPaymentMethod === 'hodl' ? (
                            <CheckCircle className="h-5 w-5 text-orange-600" />
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200">ACTIF</Badge>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </RadioGroup>
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
              {selectedPaymentMethod === 'maxelpay' && `Payer avec MaxelPay - ${total}€`}
              {selectedPaymentMethod === 'hodl' && `Acheter et payer via Hodl Hodl - ${total}€`}
              {selectedPaymentMethod === 'dundle' && `Payer avec un voucher Dundle - ${total}€`}
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

      {/* Hodl Hodl Modal */}
      <Dialog open={hodlModalOpen} onOpenChange={setHodlModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bitcoin className="h-6 w-6 text-orange-600" />
              <span>Paiement via Hodl Hodl</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {isNovice === null && (
              <div className="text-center space-y-4">
                <p className="text-lg font-medium">Êtes-vous novice en Bitcoin ?</p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setIsNovice(true)} variant="outline" className="px-8">
                    Oui, je suis novice
                  </Button>
                  <Button onClick={() => setIsNovice(false)} className="px-8">
                    Non, j'ai déjà des cryptos
                  </Button>
                </div>
              </div>
            )}

            {isNovice === true && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Guide pour débutants :</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>Créez un compte sur <strong>hodlhodl.com</strong></li>
                    <li>Vérifiez votre identité (documents requis)</li>
                    <li>Choisissez un <strong>vendeur fiable</strong> (regardez les évaluations)</li>
                    <li>Initiez un <strong>contrat d'escrow</strong> pour la sécurité</li>
                    <li>Effectuez le paiement selon les instructions du vendeur</li>
                    <li>Une fois confirmé, les Bitcoin sont transférés automatiquement</li>
                    <li><strong>Important :</strong> Cliquez sur "Libérer l'escrow" après réception</li>
                  </ol>
                </div>
              </div>
            )}

            {isNovice !== null && (
              <div className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    Adresse de réception Bitcoin :
                  </h3>
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded border">
                    <code className="flex-1 text-sm break-all">bc1qxt5rk6nsawuncf5z0vwq6rdtvvjq6pu3ssh9yl</code>
                    <Button onClick={copyBitcoinAddress} size="sm" variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Important :</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                    <li>Vérifiez l'adresse Bitcoin avant d'envoyer</li>
                    <li>Les transactions Bitcoin sont <strong>irréversibles</strong></li>
                    <li>Attendez au moins 1 confirmation réseau</li>
                    <li>Nous vous préviendrons dès réception</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setHodlModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleHodlPaymentConfirm} className="bg-orange-600 hover:bg-orange-700">
                    J'ai effectué le paiement
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dundle Modal */}
      <Dialog open={dundleModalOpen} onOpenChange={setDundleModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Gift className="h-6 w-6 text-green-600" />
              <span>Paiement par Voucher Dundle</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Comment obtenir des vouchers Dundle :
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>Rendez-vous sur <strong>dundle.com</strong></li>
                <li>Achetez des codes vouchers pour le montant souhaité</li>
                <li>Recevez vos codes par email instantanément</li>
                <li>Saisissez les codes ci-dessous</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Vos vouchers :</h3>
              {vouchers.map((voucher, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Code voucher"
                      value={voucher.code}
                      onChange={(e) => updateVoucher(index, 'code', e.target.value)}
                    />
                    <Input
                      placeholder="Montant (€)"
                      type="number"
                      value={voucher.amount}
                      onChange={(e) => updateVoucher(index, 'amount', e.target.value)}
                    />
                  </div>
                  {vouchers.length > 1 && (
                    <Button
                      onClick={() => removeVoucher(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button onClick={addVoucher} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un autre voucher
              </Button>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total des vouchers :</span>
                  <span className="text-xl font-bold text-blue-600">{calculateVouchersTotal().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Montant de la commande :</span>
                  <span className="font-semibold">{total}€</span>
                </div>
              </div>

              {calculateVouchersTotal() >= total && (
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg text-center">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    ✓ Montant suffisant pour votre commande
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setDundleModalOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={submitVouchers}
                disabled={isSubmitting || calculateVouchersTotal() < total}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Valider les vouchers'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}