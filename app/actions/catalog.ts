"use server"

import { searchAnime, Anime } from "@/lib/jikan";
import { updateAnimePrice } from "@/lib/admin";

export async function searchAnimeAction(query: string): Promise<Anime[]> {
  return await searchAnime(query);
}

export async function updatePriceAction(id: string, price: number, discountedPrice?: number) {
    return await updateAnimePrice(id, price, discountedPrice);
}
