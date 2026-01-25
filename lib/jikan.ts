// Jikan API Service

export interface Anime {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  genre: string[];
  year: number;
  episodes: number;
  isNew?: boolean;
  isTrending?: boolean;
}

const BASE_URL = "https://api.jikan.moe/v4";

// Helper to generate a consistent price based on ID
function generatePrice(id: number, score: number): number {
  const base = 2.99;
  const ratingBonus = (score || 7) - 5; // e.g., 8.5 -> 3.5
  // Use last digit of ID for some "random" variance
  const variance = (id % 10) * 0.1; 
  return parseFloat((base + (ratingBonus * 0.5) + variance).toFixed(2));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapJikanToAnime(item: any): Anime {
  return {
    id: item.mal_id.toString(),
    title: item.title_english || item.title,
    description: item.synopsis || "No description available.",
    image: item.images.jpg.large_image_url || item.images.jpg.image_url,
    price: generatePrice(item.mal_id, item.score),
    rating: item.score || 0,
    genre: item.genres ? item.genres.map((g: { name: string }) => g.name) : [],
    year: item.year || new Date().getFullYear(),
    episodes: item.episodes || 0,
    isTrending: item.score > 8.0,
    isNew: item.year === new Date().getFullYear() || item.airing,
  };
}

export async function getTopAnime(limit = 10): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/top/anime?limit=${limit}&filter=bypopularity`);
    if (!res.ok) throw new Error("Failed to fetch top anime");
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.data.map((item: any) => mapJikanToAnime(item));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTrendingAnime(limit = 10): Promise<Anime[]> {
    try {
      const res = await fetch(`${BASE_URL}/top/anime?limit=${limit}&filter=airing`);
      if (!res.ok) throw new Error("Failed to fetch trending anime");
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.data.map((item: any) => mapJikanToAnime(item));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

export async function getAnimeById(id: string): Promise<Anime | null> {
  try {
    const res = await fetch(`${BASE_URL}/anime/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return mapJikanToAnime(data.data);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function searchAnime(query: string): Promise<Anime[]> {
    try {
        const res = await fetch(`${BASE_URL}/anime?q=${query}&limit=12`);
        if (!res.ok) return [];
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.data.map((item: any) => mapJikanToAnime(item));
    } catch (error) {
        console.error(error);
        return [];
    }
}
