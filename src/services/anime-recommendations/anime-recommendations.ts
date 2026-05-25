import { jikanApiUrl } from "../apiAxios";
import type { JikanAnimeRecomendations } from "../jikan-API.type";
import { mapJikanRecommendationsList } from "./anime-recommendations.mapper";
import type { AnimeRecomendationCardType } from "./anime-recommendations.type";


export async function getRecomendationsAnimes(animeId: number): Promise<AnimeRecomendationCardType[]> {
  const { data } = await jikanApiUrl.get<{ data: JikanAnimeRecomendations[]}>(`/anime/${animeId}/recommendations`);
  return mapJikanRecommendationsList(data.data)
}
