import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AniRent | Cyberpunk Anime Rental",
  description: "Rent your favorite anime in a neon-soaked world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-card py-8 mt-12 border-t border-border">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>&copy; 2026 AniRent. All rights reserved.</p>
            </div>
          </footer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}