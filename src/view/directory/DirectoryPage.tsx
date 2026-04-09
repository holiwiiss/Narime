import { useState, useEffect } from "react";
import { getTopAnime, getSeasonalAnimes, getTrendingAnimes } from "../../api/anime";
import "./directorypage.scss";
import type { AnimeType } from "../../types/animeTyping";

const DirectoryPage = () => {
  const [animeList, setAnimeList] = useState<AnimeType[]>([]);
  const [myList, setMyList] = useState<number[]>([])

  useEffect(() => {
    const fetchAnime = async () => {
      const dataJSON: AnimeType [] = await getTopAnime(1);
      setAnimeList(dataJSON);
    };
    fetchAnime();
  }, []);

  const trendingAnime = async () => {
    const dataJSON: AnimeType [] = await getTrendingAnimes()
    setAnimeList(dataJSON);
  }

  const topAnime = async (number:number) => {
    const dataJSON: AnimeType [] = await getTopAnime(number)
    setAnimeList(dataJSON);
  }

  const seasonalAnime = async () => {
    const dataJSON: AnimeType [] = await getSeasonalAnimes()
    setAnimeList(dataJSON);
  }
  const addToMyList = (Animeid:number) => {
    setMyList(prevList => [...prevList, Animeid]);
    console.log(myList)
  }
  console.log(animeList.length)

  return (
    <>
    <div className="bton__container">
      <button className="bton" onClick={() => trendingAnime()}>Trending</button>
      <button className="bton" onClick={() => topAnime(1)}>Top 100</button>
      <button className="bton" onClick={() => seasonalAnime()}>Seasonal</button>
    </div>

    <div className="cards__container">
      {animeList.length === 0 ? (
        <h1>No se han encontrado animes</h1>
      ) : (
        animeList.map((anime: any) => (
          <div className="anime__card" id={anime.id}>
            <h1>{anime.title}</h1>
            <img src={anime.image} />
            <h2>{anime.score}</h2>
            <h2>{anime.episodes}</h2>
            <button onClick={() => addToMyList(anime.id)}> Add to list</button>
          </div>
        ))
      )}
      </div>
    </>

  );
};


export default DirectoryPage;
