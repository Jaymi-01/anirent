"use client"

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Anime } from '@/lib/jikan';
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ anime }: { anime: Anime }) {
  const { addToCart } = useCart();

  return (
    <Button 
      size="lg" 
      onClick={() => addToCart(anime)}
      className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold h-14 px-8 text-lg shadow-[0_0_20px_rgba(251,191,36,0.4)]"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Rent for ${anime.price}
    </Button>
  );
}
