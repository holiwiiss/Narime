import type { JikanAnimeListType } from "../jikan-API.type";
import type { AnimeListType } from "./anime-list.type";

export function mapJikanAnimeList(data: JikanAnimeListType[]): AnimeListType[] {
  const dataMapped = data.map((anime): AnimeListType => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.webp.image_url,
    score: anime.score,
    episodes: anime.episodes,
    generes: anime.genres.map(g => g.name),
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
