import { getTrendingAnime } from "@/lib/jikan";
import { AnimeCard } from "@/components/AnimeCard";

export default async function TrendingPage() {
  const animes = await getTrendingAnime(12);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500 mb-4">
          Trending Now
        </h1>
        <p className="text-xl text-muted-foreground">
          See what everyone is watching right now.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {animes.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
}
