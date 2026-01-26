"use client"

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { checkout } from "@/lib/checkout";
import { sendOrderConfirmation } from "@/app/actions/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/catalog">
          <Button variant="default">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await signInWithGoogle();
      return;
    }

    if (!formData.name || !formData.email || !formData.address || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderId = await checkout(cart, total, user.uid, formData);
      
      // Send Email Notification
      await sendOrderConfirmation({
        orderId,
        customerName: formData.name,
        customerEmail: formData.email,
        items: cart,
        total: total
      });

      toast.success("Order placed successfully! Check your email.");
      clearCart();
      router.push("/checkout/success"); 
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <Link href="/" className="flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Checkout
            </h1>
            <p className="text-muted-foreground">Please provide your rental information.</p>
          </div>

          {!user ? (
            <Card className="bg-primary/5 border-primary/20 p-6">
              <p className="mb-4">You need to sign in to complete your order.</p>
              <Button onClick={signInWithGoogle} className="w-full bg-primary hover:bg-primary/80">
                Sign in with Google
              </Button>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. John Doe"
                      className="bg-background/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                      type="email" 
                      placeholder="e.g. john@example.com"
                      className="bg-background/50" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+1 (555) 000-0000" 
                    required 
                    className="bg-background/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rental Address (for physical copies)</label>
                  <Input 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="123 Cyber St, Neo Tokyo" 
                    required 
                    className="bg-background/50" 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-secondary" /> Payment Method
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Currently, we only support **Pay on Rental**. You will be contacted for payment details.
                </p>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/80 text-black font-bold h-14 text-lg shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : `Place Rental Order - $${total.toFixed(2)}`}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card className="bg-card/40 border-primary/20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 rounded overflow-hidden">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-accent">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="bg-white/10 my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Rental Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 text-white">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}