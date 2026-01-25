"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime } from '@/lib/jikan';
import { toast } from 'sonner';

interface CartItem extends Anime {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (anime: Anime) => void;
  removeFromCart: (animeId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('anirent-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('anirent-cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (anime: Anime) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === anime.id);
      if (existing) {
        toast.info(`Added another ${anime.title} to cart`);
        return prev.map(item => 
          item.id === anime.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      toast.success(`${anime.title} added to cart`);
      return [...prev, { ...anime, quantity: 1 }];
    });
  };

  const removeFromCart = (animeId: string) => {
    setCart(prev => prev.filter(item => item.id !== animeId));
    toast.error("Removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
