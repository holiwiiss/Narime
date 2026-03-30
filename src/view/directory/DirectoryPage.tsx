import { useState, useEffect } from "react";
import { getTopAnime } from "../../api/anime";
import "./directorypage.scss";

const DirectoryPage = () => {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const fetchAnime = async () => {
      const data = await getTopAnime();
      setAnimeList(data);
    };
    fetchAnime();
  }, []);

  console.log(animeList.length)

  return (
    <>
    <button>Trending</button>
    <button>Top 50</button>
      {animeList.length === 0 ? (
        <h1>No se han encontrado animes</h1>
      ) : (
        animeList.map((anime: any) => (
          <div id={anime.id}>
            <h1>{anime.title}</h1>
            <img src={anime.image} />
            <h2>{anime.score}</h2>
            <h2>{anime.episodes}</h2>
          </div>
        ))
      )}
    </>
  );
};

export default DirectoryPage;
