const URL__JIKAN= 'https://api.jikan.moe/v4/'

interface AnimeType {
  id: number;
  title: string;
  image: string;
  score: number;
  episodes: number;
  generes: string[];
} 

export async function getTopAnime() {
  //JIKAN API está capado por 25 animes por página
  const request = URL__JIKAN + 'top/anime?page=1&sfw=true';
  console.log(request)
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.data) return [];

    const finalData = json.data.map((anime:any) => ({
        id: anime.mal_id,
        title: anime.title,
        image: anime.images.webp.image_url,
        score: anime.score,
        episodes: anime.episodes,
        //tengo que hacer un bucle aquí también para sacar las cosas
        genres: anime.genres.name,
    }));
    console.log(finalData)
    return finalData;

  } catch (error:any) {
    console.error(error.message);
    return [];
  }
}
