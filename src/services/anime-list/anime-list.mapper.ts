import type { JikanAnimeListType } from "../jikan-API.type";
import type { AnimeCardType } from "./anime-list.type";

export function mapJikanAnimeList(data: JikanAnimeListType[]): AnimeCardType[] {
  const dataMapped = data.map((anime): AnimeCardType => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.large_image_url,
    score: anime.score ?? null,
    episodes: anime.episodes ?? 1,
    year: anime.year ?? null,
    type:anime.type
  }));

  const arrayAnimesID: number[]=  []

  return dataMapped.filter((anime) => {
    if(arrayAnimesID.includes(anime.id)){
      return false
    }else{
      arrayAnimesID.push(anime.id)
      return true
    }
  })
}
