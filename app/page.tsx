import { FeaturedSection } from "@/components/FeaturedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AnimeGridSkeleton } from "@/components/AnimeGridSkeleton";
import { GENRE_MAP } from "@/lib/jikan";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ... (Hero section unchanged) ... */}
      
      {/* Featured Section */}
      <section className="py-20 container mx-auto px-4">
        {/* ... (Featured content unchanged) ... */}
      </section>

      {/* Categories Banner */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Browse by Genre</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(GENRE_MAP).slice(0, 6).map((genre) => (
              <Link key={genre} href={`/catalog?genre=${GENRE_MAP[genre]}&name=${genre}`}>
                <Button 
                  variant="outline" 
                  className="h-24 w-40 text-lg border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  {genre}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}