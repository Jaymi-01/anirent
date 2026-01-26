// Jikan API Service
import { db } from "./firebase";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";

export interface Anime {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  genre: string[];
  year: number;
  episodes: number;
  isNew?: boolean;
  isTrending?: boolean;
}

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    };
  };
  score: number;
  genres: Array<{ name: string }>;
  year: number;
  airing: boolean;
  episodes: number;
}

interface PriceOverrideData {
  price: number;
  discountedPrice?: number;
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

function mapJikanToAnime(item: JikanAnime): Anime {
  return {
    id: item.mal_id.toString(),
    title: item.title_english || item.title,
    description: item.synopsis || "No description available.",
    image: item.images.jpg.large_image_url || item.images.jpg.image_url,
    price: generatePrice(item.mal_id, item.score),
    rating: item.score || 0,
    genre: item.genres ? item.genres.map((g) => g.name) : [],
    year: item.year || new Date().getFullYear(),
    episodes: item.episodes || 0,
    isTrending: item.score > 8.0,
    isNew: item.year === new Date().getFullYear() || item.airing,
  };
}

async function fetchPriceOverrides(ids: string[]) {
  if (ids.length === 0) return {};
  
  try {
      // Create chunks of 10 for 'in' query to be safe and efficient
      const chunks = [];
      for (let i = 0; i < ids.length; i += 10) {
          chunks.push(ids.slice(i, i + 10));
      }

      const overrides: Record<string, PriceOverrideData> = {};

      for (const chunk of chunks) {
          const q = query(collection(db, "prices"), where(documentId(), "in", chunk));
          const snapshot = await getDocs(q);
          snapshot.forEach(doc => {
              overrides[doc.id] = doc.data() as PriceOverrideData;
          });
      }

      return overrides;
  } catch (e) {
      console.error("Error fetching prices", e);
      return {};
  }
}

async function mergePrices(animes: Anime[]): Promise<Anime[]> {
    const ids = animes.map(a => a.id);
    const overrides = await fetchPriceOverrides(ids);
    
    return animes.map(a => {
        const override = overrides[a.id];
        if (override) {
            if (override.discountedPrice) {
                return { 
                    ...a, 
                    price: override.discountedPrice, 
                    originalPrice: override.price 
                };
            }
            return { ...a, price: override.price };
        }
        return a;
    });
}

export async function getTopAnime(limit = 10): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/top/anime?limit=${limit}&filter=bypopularity`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error("Failed to fetch top anime");
    const data = await res.json();
    const animes = data.data.map((item: JikanAnime) => mapJikanToAnime(item));
    return await mergePrices(animes);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTrendingAnime(limit = 10): Promise<Anime[]> {
    try {
      const res = await fetch(`${BASE_URL}/top/anime?limit=${limit}&filter=airing`, {
        next: { revalidate: 3600 }
      });
      if (!res.ok) throw new Error("Failed to fetch trending anime");
      const data = await res.json();
      const animes = data.data.map((item: JikanAnime) => mapJikanToAnime(item));
      return await mergePrices(animes);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

export async function getAnimeById(id: string): Promise<Anime | null> {
  try {
    const res = await fetch(`${BASE_URL}/anime/${id}`, {
      next: { revalidate: 86400 } // Cache specific anime for 24 hours
    });
    if (!res.ok) return null;
    const data = await res.json();
    const anime = mapJikanToAnime(data.data);
    const [mergedAnime] = await mergePrices([anime]);
    return mergedAnime;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const GENRE_MAP: Record<string, number> = {
  "Action": 1,
  "Adventure": 2,
  "Comedy": 4,
  "Drama": 8,
  "Fantasy": 10,
  "Horror": 14,
  "Romance": 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  "Supernatural": 37,
};

export async function searchAnime(query: string, genreId?: string): Promise<Anime[]> {
    try {
        let url = `${BASE_URL}/anime?limit=12`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (genreId) url += `&genres=${genreId}`;

        const res = await fetch(url, {
          next: { revalidate: 600 } // Cache search results for 10 mins
        });
        if (!res.ok) return [];
        const data = await res.json();
        const animes = data.data.map((item: JikanAnime) => mapJikanToAnime(item));
        return await mergePrices(animes);
    } catch (error) {
        console.error(error);
        return [];
    }
}
