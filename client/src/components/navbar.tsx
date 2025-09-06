import { useState } from "react";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { Language } from "../types";
import { getLanguageEmoji } from "../lib/language";

interface NavbarProps {
  user: User | null;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLoginClick: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  t: (key: string) => string;
}

export default function Navbar({ 
  user, 
  language, 
  onLanguageChange, 
  onLoginClick, 
  onCartClick, 
  cartItemCount,
  t 
}: NavbarProps) {
  const languages: { value: Language; label: string }[] = [
    { value: 'fr', label: `${getLanguageEmoji('fr')} FR` },
    { value: 'en', label: `${getLanguageEmoji('en')} EN` },
    { value: 'pl', label: `${getLanguageEmoji('pl')} PL` },
    { value: 'es', label: `${getLanguageEmoji('es')} ES` },
    { value: 'pt', label: `${getLanguageEmoji('pt')} PT` },
    { value: 'it', label: `${getLanguageEmoji('it')} IT` },
    { value: 'hu', label: `${getLanguageEmoji('hu')} HU` },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-gold bg-clip-text text-transparent" data-testid="logo">
              LUXIO
            </h1>
            <span className="ml-2 text-sm text-muted-foreground" data-testid="tagline">
              {t('hero.tagline')}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="#smartphones" className="text-foreground hover:text-primary transition-colors" data-testid="nav-smartphones">
              {t('nav.smartphones')}
            </a>
            <a href="#smartwatches" className="text-foreground hover:text-primary transition-colors" data-testid="nav-watches">
              {t('nav.watches')}
            </a>
            <a href="#sneakers" className="text-foreground hover:text-primary transition-colors" data-testid="nav-fashion">
              {t('nav.fashion')}
            </a>
            <a href="#smart_home" className="text-foreground hover:text-primary transition-colors" data-testid="nav-home">
              {t('nav.home')}
            </a>
            <a href="#mobility" className="text-foreground hover:text-primary transition-colors" data-testid="nav-mobility">
              {t('nav.mobility')}
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={onLanguageChange} data-testid="language-selector">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Auth Button */}
            <Button variant="ghost" onClick={onLoginClick} data-testid="login-button">
              <UserIcon className="mr-1 h-4 w-4" />
              {user ? user.displayName || user.email : t('nav.login')}
            </Button>

            {/* Cart Button */}
            <Button onClick={onCartClick} className="relative" data-testid="cart-button">
              <ShoppingCart className="mr-1 h-4 w-4" />
              {t('nav.cart')}
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
