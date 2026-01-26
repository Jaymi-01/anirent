import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <CheckCircle2 className="h-24 w-24 text-emerald-500 animate-in zoom-in duration-500" />
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
        Order Successfully Placed!
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mb-12">
        Thank you for your rental! Your order has been recorded in our system. 
        <span className="block mt-4 text-white font-medium flex items-center justify-center gap-2">
          <Mail className="h-5 w-5 text-accent" /> Please check your email for confirmation and next steps.
        </span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" variant="outline" className="border-primary/50 gap-2">
            <Home className="h-5 w-5" /> Back to Home
          </Button>
        </Link>
        <Link href="/catalog">
          <Button size="lg" className="bg-primary hover:bg-primary/80 gap-2">
            Rent More <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="mt-20 p-6 rounded-xl bg-card/30 border border-white/5 max-w-md">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">What happens next?</h3>
        <p className="text-sm text-gray-400">
          Our team will review your rental request. You will receive another notification once the physical copies are dispatched or the digital link is activated.
        </p>
      </div>
    </div>
  );
}
