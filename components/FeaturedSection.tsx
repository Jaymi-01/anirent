import { getTopAnime } from "@/lib/jikan";
import { AnimeCard } from "@/components/AnimeCard";

export async function FeaturedSection() {
  const featuredAnimes = await getTopAnime(4);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {featuredAnimes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
