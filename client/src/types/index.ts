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

export interface Order {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    phone: string;
  };
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}
