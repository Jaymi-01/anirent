"use client"

import { useState, useEffect } from "react";
import { X, PackageOpen, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function OrderSuccessPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already seen this guide
    const hasSeenGuide = localStorage.getItem('hideOrderGuide');
    if (hasSeenGuide === 'true') {
      return;
    }

    // Show popup after a short delay for effect
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideOrderGuide', 'true');
    }
    setIsOpen(false);
  };

  const handleNavigate = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideOrderGuide', 'true');
    }
    router.push('/orders');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <PackageOpen className="h-8 w-8 text-primary animate-bounce" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Track Your Order</h2>
          
          <p className="text-muted-foreground">
            Want to see when your anime arrives? You can now track your order status in real-time!
          </p>

          <div className="w-full bg-muted/40 p-4 rounded-lg text-sm text-left border border-border/50">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> How to find it later:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-1">
              <li>Click on your <span className="text-foreground font-medium">Profile Icon</span> (top right).</li>
              <li>Select <span className="text-foreground font-medium">My Orders</span>.</li>
            </ol>
          </div>

          <div className="flex gap-3 w-full pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Close
            </Button>
            <Button className="flex-1" onClick={handleNavigate}>
              Go to My Orders <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              id="dontShow" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-background accent-primary cursor-pointer"
            />
            <label 
              htmlFor="dontShow" 
              className="text-xs text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
            >
              Don't show this guide again
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}