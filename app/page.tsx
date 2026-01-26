import { FeaturedSection } from "@/components/FeaturedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AnimeGridSkeleton } from "@/components/AnimeGridSkeleton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        
        <div className="container mx-auto relative z-10 px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="mr-2 h-4 w-4" />
            <span className="animate-pulse">New Arrivals Available</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-orange-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-in fade-in zoom-in duration-1000 delay-150">
            Rent Your Next <br /> 
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Adventure</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Dive into a curated collection of the best anime series and movies. 
            Stream instantly in high quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link href="/catalog">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 shadow-[0_0_20px_rgba(59,130,246,0.5)] w-full sm:w-auto text-lg h-12">
                Start Watching
                </Button>
            </Link>
            <Link href="/trending">
                <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 w-full sm:w-auto h-12 backdrop-blur-sm">
                View Trending
                </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-700" />
      </section>

      {/* Featured Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Series</h2>
            <p className="text-muted-foreground">Hand-picked for you this week.</p>
          </div>
          <Link href="/catalog">
            <Button variant="ghost" className="text-secondary hover:text-secondary/80 hover:bg-secondary/10">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Suspense fallback={<AnimeGridSkeleton count={4} />}>
            <FeaturedSection />
        </Suspense>
      </section>

      {/* Categories Banner */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Browse by Genre</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Action", "Romance", "Sci-Fi", "Fantasy", "Horror", "Slice of Life"].map((genre) => (
              <Button 
                key={genre}
                variant="outline" 
                className="h-24 w-40 text-lg border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}