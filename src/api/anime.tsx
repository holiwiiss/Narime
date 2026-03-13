const URL= 'https://api.jikan.moe/v4/'

async function getTopAnime() {
  const request = URL + 'top/anime';
  console.log(request)
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    const finalData = json.data.map((anime:any) => ({
        id: anime.mal_id,
        title: anime.title,
        image: anime.images.webp.image_url,
        score: anime.score,
        episodes: anime.episodes,
        genres: anime.genres,
        aired: anime.aired
    }))

    return finalData;

  } catch (error:any) {
    console.error(error.message);
  }
}

export {getTopAnime} 