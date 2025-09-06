import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, signInWithGoogle, handleRedirectResult, logOut } from "../lib/firebase";
import { useCart } from "../hooks/use-cart";
import { useLanguage } from "../hooks/use-language";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import ProductSection from "../components/product-section";
import CustomerReviews from "../components/customer-reviews";
import PaymentMethods from "../components/payment-methods";
import Footer from "../components/footer";
import AuthModal from "../components/auth-modal";
import CartSidebar from "../components/cart-sidebar";
import { Product } from "../types";
import productsData from "../data/products.json";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Record<string, Product>>({});
  const { language, changeLanguage, t } = useLanguage();

  // Flatten products from categories into a single object
  useEffect(() => {
    const products: Record<string, Product> = {};
    Object.values(productsData).forEach((categoryProducts) => {
      categoryProducts.forEach((product) => {
        products[product.id] = product;
      });
    });
    setAllProducts(products);
  }, []);

  const { cart, addToCart, removeFromCart, updateQuantity, total, itemCount } = useCart(allProducts);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      // Close auth modal when user successfully logs in
      if (user) {
        setAuthModalOpen(false);
      }
    });

    // Handle redirect result on page load
    handleRedirectResult().then((user) => {
      if (user) {
        setUser(user);
        setAuthModalOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setAuthModalOpen(true);
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleLogout = () => {
    logOut();
    setUser(null);
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    // Don't open cart automatically - user gets toast notification instead
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="home-page">
      <Navbar
        user={user}
        language={language}
        onLanguageChange={changeLanguage}
        onLoginClick={user ? handleLogout : handleLogin}
        onCartClick={() => setCartSidebarOpen(true)}
        cartItemCount={itemCount}
        t={t}
      />

      <Hero t={t} />

      {/* Smartphones Section */}
      <section id="smartphones">
        <ProductSection
          title={t('sections.smartphones_title')}
          subtitle="Réduction 15-22% • Livraison express incluse"
          products={productsData.smartphones}
          backgroundColor="bg-card"
          onAddToCart={handleAddToCart}
          t={t}
        />
      </section>

      {/* Smartwatches Section */}
      <section id="smartwatches">
        <ProductSection
          title={t('sections.watches_title')}
          subtitle="Réduction 28-37% sur modèles luxe"
          products={productsData.smartwatches}
          backgroundColor="bg-background"
          onAddToCart={handleAddToCart}
          t={t}
        />
      </section>

      {/* Sneakers Section */}
      <section id="sneakers">
        <ProductSection
          title="Sneakers & Mode Tendance"
          subtitle="Réduction 17% • Livraison gratuite"
          products={productsData.sneakers}
          backgroundColor="bg-card"
          onAddToCart={handleAddToCart}
          t={t}
        />
      </section>

      {/* Smart Home Section */}
      <section id="smart_home">
        <ProductSection
          title="Gadgets Maison Intelligents"
          subtitle="Réduction 13% • Livraison gratuite"
          products={productsData.smart_home}
          backgroundColor="bg-background"
          onAddToCart={handleAddToCart}
          t={t}
        />
      </section>

      {/* Mobility Section */}
      <section id="mobility">
        <ProductSection
          title="Mobilité Urbaine"
          subtitle="Réduction 13% • Livraison gratuite"
          products={productsData.mobility}
          backgroundColor="bg-card"
          onAddToCart={handleAddToCart}
          t={t}
        />
      </section>

      <CustomerReviews t={t} />
      <PaymentMethods t={t} />
      <Footer t={t} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        user={user}
        t={t}
      />

      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
        cart={cart}
        products={allProducts}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        total={total}
        t={t}
      />
    </div>
  );
}
