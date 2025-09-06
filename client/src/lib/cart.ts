import { CartItem, Product } from "../types";

const CART_STORAGE_KEY = "luxio-cart";

export const getCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
};

export const addToCart = (productId: string, quantity: number = 1): CartItem[] => {
  const cart = getCartFromStorage();
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  
  saveCartToStorage(cart);
  return cart;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const cart = getCartFromStorage();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCartToStorage(updatedCart);
  return updatedCart;
};

export const updateCartItemQuantity = (productId: string, quantity: number): CartItem[] => {
  const cart = getCartFromStorage();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCartToStorage(cart);
  }
  
  return cart;
};

export const calculateCartTotal = (cart: CartItem[], products: Record<string, Product>): number => {
  return cart.reduce((total, item) => {
    const product = products[item.id];
    return product ? total + (product.price * item.quantity) : total;
  }, 0);
};

export const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
