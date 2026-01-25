"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";

export function CartSheet() {
  const { cart, removeFromCart, total } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/50 hover:bg-primary/20 hover:text-primary transition-all duration-300">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-[0_0_10px_var(--color-accent)]">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-background border-l border-primary/30 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Loot ({itemCount})
          </SheetTitle>
        </SheetHeader>
        
        <Separator className="my-4 bg-primary/20" />
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground space-y-4">
            <ShoppingCart className="h-16 w-16 opacity-20" />
            <p>Your cart is empty, traveler.</p>
            <Button variant="link" className="text-secondary">
              Browse Anime
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-card/50 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="relative h-20 w-16 rounded overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-primary-foreground">{item.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="text-accent font-medium">${item.price}</span>
                        <span className="mx-2">•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-primary/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-accent drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold border-0 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all transform hover:scale-[1.02]">
                Checkout Now
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
