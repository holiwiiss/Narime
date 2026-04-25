import { useEffect, useState } from "react";
import { useAddAnimeList } from "../../context/MyListContext";
import type { AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { getAnimeInformation } from "../../services/anime-information/anime-information";
import { useNavigate } from "react-router-dom";


const MyListPage = () =>{
    const navigate = useNavigate()

  const {animes} = useAddAnimeList()
  const [animeList, setAnimeList] = useState<AnimeInformationType[]>([]);
  console.log(animes)

  useEffect(() => {

    const fetchAnimes = async () => {
      try {
        const JSON: AnimeInformationType[] = await Promise.all(
            animes.map(id => getAnimeInformation(id))
        );
        setAnimeList(JSON);
      } catch (e) {
        console.log("La api no responde " + e);
      }
    };
    fetchAnimes();
  }, []);

  

return(
    <>
    <div className="cards__container">
          {animeList.length === 0 ? (
            <h1>No se han encontrado animes</h1>
          ) : (
            animeList.map((anime: AnimeInformationType) => (
              <div key={anime.id} className="anime__card" onClick={() => navigate(`/anime/${anime.id}`)}>
                <h1>{anime.title}</h1>
                <img src={anime.images}/>
                <div className="information__container">
                  <h2>Score: {anime.score}</h2>
                  <h2>Episodes: {anime.episodes}</h2>
                </div>
              </div>
            ))
          )}
          </div>
    </>
)
}

export default MyListPage;