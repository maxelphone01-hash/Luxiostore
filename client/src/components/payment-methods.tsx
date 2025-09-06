import { Coins, CreditCard, ArrowLeftRight, Shield } from "lucide-react";

interface PaymentMethodsProps {
  t: (key: string) => string;
}

export default function PaymentMethods({ t }: PaymentMethodsProps) {
  const paymentMethods = [
    {
      id: 'nowpayments',
      name: 'NOWPayments',
      icon: Coins,
      description: 'Cryptomonnaies acceptées',
      status: 'active'
    },
    {
      id: 'maxelpay',
      name: 'MaxelPay',
      icon: CreditCard,
      description: 'Cartes bancaires & virements',
      status: 'active'
    },
    {
      id: 'transak',
      name: 'Transak',
      icon: ArrowLeftRight,
      description: 'Fiat vers crypto',
      status: 'coming_soon'
    },
    {
      id: 'guardarian',
      name: 'Guardarian',
      icon: Shield,
      description: 'Fiat + Crypto widget',
      status: 'coming_soon'
    }
  ];

  return (
    <section className="py-16 bg-card" data-testid="payment-methods-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" data-testid="payment-title">
            Méthodes de Paiement
          </h2>
          <p className="text-muted-foreground" data-testid="payment-subtitle">
            Paiements sécurisés et flexibles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isActive = method.status === 'active';
            
            return (
              <div 
                key={method.id}
                className={`rounded-lg p-6 hover-scale ${
                  isActive 
                    ? 'bg-secondary border-2 border-accent' 
                    : 'bg-muted opacity-60'
                }`}
                data-testid={`payment-method-${method.id}`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isActive ? 'bg-accent text-accent-foreground' : 'bg-muted-foreground text-background'
                  }`}>
                    <Icon className="text-2xl h-8 w-8" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`} data-testid={`payment-name-${method.id}`}>
                    {method.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`payment-description-${method.id}`}>
                    {method.description}
                  </p>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted-foreground text-background'
                  }`} data-testid={`payment-status-${method.id}`}>
                    {isActive ? 'ACTIF' : 'BIENTÔT'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Integration Preview */}
        <div className="mt-12 bg-secondary rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center" data-testid="integration-title">
            Zone d'intégration des paiements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-accent rounded-lg p-8 text-center" data-testid="nowpayments-integration">
              <Coins className="text-accent text-3xl mb-4 h-12 w-12 mx-auto" />
              <h4 className="font-semibold mb-2">NOWPayments iframe</h4>
              <p className="text-sm text-muted-foreground">Intégration via iframe sécurisé</p>
              {/* TODO: Integrate NOWPayments iframe with public key */}
            </div>
            <div className="border-2 border-dashed border-accent rounded-lg p-8 text-center" data-testid="maxelpay-integration">
              <CreditCard className="text-accent text-3xl mb-4 h-12 w-12 mx-auto" />
              <h4 className="font-semibold mb-2">MaxelPay API/iframe</h4>
              <p className="text-sm text-muted-foreground">API ou iframe selon configuration</p>
              {/* TODO: Integrate MaxelPay API/iframe with public key */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
