"use client"

import { Anime } from '@/lib/jikan';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className={cn("group relative overflow-hidden border-border/50 bg-card/40 hover:bg-card/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-primary/50", className)}>
      <Link href={`/product/${anime.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {anime.isNew && (
              <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-0 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                NEW
              </Badge>
            )}
            {anime.isTrending && (
              <Badge className="bg-red-500 text-white hover:bg-red-600 border-0 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                HOT
              </Badge>
            )}
          </div>

          {/* Quick Actions overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-background/50 hover:bg-pink-500 hover:text-white backdrop-blur-md">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {anime.title}
          </h3>
          <div className="flex items-center text-yellow-400 text-sm">
            <Star className="h-3 w-3 fill-current mr-1" />
            {anime.rating}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genre.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              {g}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Rent for</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">
              ${anime.price.toFixed(2)}
            </span>
            {anime.originalPrice && (
              <span className="text-xs text-muted-foreground line-through decoration-destructive">
                ${anime.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <Button 
          onClick={() => addToCart(anime)}
          size="sm"
          className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
