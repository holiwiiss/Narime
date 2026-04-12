import type { AnimeListType, PaginationType } from "../types/api/animeListTyping";
import type { JikanAnimeListType, JikanPaginationType } from "../types/api/JikanAPITyping";

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

export function mapJikanAnimePagination(pagination: JikanPaginationType) :  PaginationType{
  return {
    last_visible_page: pagination.last_visible_page,
    has_next_page: pagination.has_next_page,
    current_page: pagination.current_page,
  }
}