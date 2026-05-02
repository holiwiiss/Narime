import { useEffect, useState } from "react";
import { useAddAnimeList } from "../../context/MyListContext";
import type { AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { getAnimeInformation } from "../../services/anime-information/anime-information";
import { useNavigate } from "react-router-dom";

type ContentList = {
  animeID: number;
  animeStatus: string;
  animeScore: number | null;
  animeEpisodes: number;
};

type MyListAnime = {
  api: AnimeInformationType;
  user: ContentList;
}

const MyListPage = () =>{
    const navigate = useNavigate()

  const {animes} = useAddAnimeList()
  const [animeList, setAnimeList] = useState<MyListAnime[]>([]);
  console.log(animes)

  useEffect(() => {

    const fetchAnimes = async () => {
      try {
        const JSON: MyListAnime[] = await Promise.all(
            animes.map( async (anime) => {
              const apiData = await getAnimeInformation(anime.animeID);
              return {
                api: apiData,
                user: anime,
              };
            })
        );
      setAnimeList(JSON)
      } catch (e) {
        console.log("La api no responde " + e);
      }
    };
    fetchAnimes();
  }, [animes]);

  

return(
    <>
    <div className="cards__container">
          {animeList.length === 0 ? (
            <h1>No se han encontrado animes</h1>
          ) : (
            animeList.map((anime: MyListAnime) => (
              <div key={anime.user.animeID} className="anime__card" onClick={() => navigate(`/anime/${anime.user.animeID}`)}>
                <h1>{anime.api.title}</h1>
                <img src={anime.api.images}/>
                <div className="information__container">
                  <h2>Score: {anime.api.score}</h2>
                  <h2>Episodes: {anime.api.episodes}</h2>
                  <h3>My Status: {anime.user.animeStatus}</h3>
                  <h3>My Score: {anime.user.animeScore}</h3>
                  <h3>Watched: {anime.user.animeEpisodes}</h3>
                </div>
              </div>
            ))
          )}
          </div>
    </>
)
}

export default MyListPage;