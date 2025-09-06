import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User as UserIcon, 
  ShoppingBag, 
  LogOut, 
  Search, 
  ShoppingCart,
  Package,
  CreditCard,
  Calendar
} from "lucide-react";
import { auth, logOut } from "../lib/firebase";
import { useLanguage } from "../hooks/use-language";
import { getUserOrders } from "../lib/orders";
import { toast } from "@/hooks/use-toast";
import { Order } from "../types";

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        setLocation('/');
      } else {
        // Load user orders
        const userOrders = getUserOrders(user.email!);
        setOrders(userOrders);
      }
    });

    return () => unsubscribe();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !"
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Payée</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
          <p className="text-muted-foreground mb-4">Veuillez vous connecter pour accéder à votre espace client</p>
          <Button onClick={() => setLocation('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="account-page">
      {/* Header with Navigation */}
      <div className="border-b border-border py-4 mb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Mon espace client</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Mini Navigation */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  className="pl-10 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="search-input"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setLocation('/')} data-testid="nav-home">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Boutique
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="logout-button">
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2" data-testid="tab-profile">
              <UserIcon className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2" data-testid="tab-orders">
              <Package className="h-4 w-4" />
              <span>Commandes ({orders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2" data-testid="tab-settings">
              <UserIcon className="h-4 w-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.displayName || 'Utilisateur'}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Membre depuis {new Date(user.metadata.creationTime!).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <div className="text-sm text-muted-foreground">Commandes</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">{orders.filter(o => o.status === 'paid').length}</div>
                        <div className="text-sm text-muted-foreground">Payées</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
                        <div className="text-sm text-muted-foreground">En attente</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-orders">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore effectué de commande.
                    </p>
                    <Button onClick={() => setLocation('/')} data-testid="start-shopping">
                      Commencer mes achats
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="p-4" data-testid={`order-${order.id}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h4 className="font-semibold">Commande {order.id}</h4>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Package className="h-4 w-4" />
                                <span>{order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-lg font-bold">{order.total}€</div>
                              <div className="text-sm text-muted-foreground">Total</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 text-sm">
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-muted-foreground">
                                    {item.price}€ × {item.quantity}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    L'email ne peut pas être modifié
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <Input
                    id="displayName"
                    value={user.displayName || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Connecté via Google Authentication
                  </p>
                </div>

                <Separator />
                
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div>
                    <h4 className="font-medium text-destructive">Zone de danger</h4>
                    <p className="text-sm text-muted-foreground">
                      Actions irréversibles sur votre compte
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}