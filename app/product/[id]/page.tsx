import { getAnimeById } from "@/lib/jikan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Play, Clock, Share2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const anime = await getAnimeById(id);

  if (!anime) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={anime.image}
          alt={anime.title}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative -mt-32 z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative h-[450px] w-[300px] rounded-lg overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-white/10">
              <Image
                src={anime.image}
                alt={anime.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-10 md:pt-32">
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genre.map((g) => (
                <Badge key={g} variant="outline" className="bg-secondary/10 border-secondary/30 text-secondary">
                  {g}
                </Badge>
              ))}
              {anime.isNew && <Badge className="bg-emerald-500">New Release</Badge>}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {anime.title}
            </h1>

            <div className="flex items-center gap-6 mb-8 text-muted-foreground">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold text-white text-lg">{anime.rating}</span>
                <span className="text-sm ml-1">(2.4k reviews)</span>
              </div>
              {anime.episodes > 0 && (
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{anime.episodes} Episodes</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 border border-white/20 rounded text-xs">TV-14</span>
              </div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mb-8">
              {anime.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <AddToCartButton anime={anime} />
              
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 gap-2 h-14">
                <Play className="h-5 w-5" />
                Watch Trailer
              </Button>
            </div>
            
            <div className="flex gap-4">
               <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                 <Share2 className="h-4 w-4 mr-2" /> Share
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}