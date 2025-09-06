import { useState, useEffect } from "react";
import { CartItem, Product } from "../types";
import { getCartFromStorage, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, updateCartItemQuantity, calculateCartTotal, getCartItemCount } from "../lib/cart";

export function useCart(products: Record<string, Product>) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCartFromStorage());
  }, []);

  const addToCart = (productId: string, quantity: number = 1) => {
    const updatedCart = addToCartUtil(productId, quantity);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = removeFromCartUtil(productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    localStorage.removeItem("luxio-cart");
    setCart([]);
  };

  const total = calculateCartTotal(cart, products);
  const itemCount = getCartItemCount(cart);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount
  };
}
