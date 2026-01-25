import { searchAnime } from "@/lib/jikan";
import { AnimeCard } from "@/components/AnimeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const animes = await searchAnime(query);

  async function searchAction(formData: FormData) {
    "use server";
    const searchQuery = formData.get("q") as string;
    redirect(`/catalog?q=${encodeURIComponent(searchQuery)}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Anime Catalog
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore our vast collection of anime series and movies.
          </p>
        </div>
        
        <form action={searchAction} className="flex w-full md:w-auto gap-2">
          <Input 
            name="q" 
            placeholder="Search anime..." 
            defaultValue={query}
            className="w-full md:w-80 bg-background/50 border-primary/20 focus:border-primary"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {animes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-xl">No anime found matching &quot;{query}&quot;</p>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
