"use client"

import Link from "next/link";
import { CartSheet } from "./CartSheet";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary tracking-tight">
            AniRent
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-foreground/80 hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            Home
          </Link>
          <Link href="/catalog" className="text-foreground/80 hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            Catalog
          </Link>
          <Link href="/trending" className="text-foreground/80 hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            Trending
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
