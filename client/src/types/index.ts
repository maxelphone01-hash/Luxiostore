export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  specifications: string[];
  images: string[];
  colors: string[];
  inStock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export interface Translation {
  [key: string]: {
    [lang: string]: string;
  };
}

export type Language = 'fr' | 'en' | 'pl' | 'es' | 'pt' | 'it' | 'hu';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'coming_soon';
  type: 'crypto' | 'fiat' | 'mixed';
}
