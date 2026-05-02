import { useEffect, useState } from "react";
import { useAddAnimeList } from "../../context/MyListContext";
import type { AnimeInformationType } from "../../services/anime-information/anime-information.type";
import { getAnimeInformation } from "../../services/anime-information/anime-information";
import { useNavigate } from "react-router-dom";
import { getAllAnimesFirebase } from "../../firebase/services/firestoreService";
import { useAuth } from "../../context/AuthContext";

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
  const {user} = useAuth ()
  const [animeList, setAnimeList] = useState<MyListAnime[]>([]);

  useEffect(() => {
    
    const fetchAnimes = async () => {
      if (!user) return;
      try {
        const animes = await getAllAnimesFirebase(user.uid);
        if(!animes) return 
        const JSON: MyListAnime[] = await Promise.all(
            animes.map( async (anime:any) => {
              const apiData = await getAnimeInformation(anime.AnimeID);
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
  }, []);

  

return(
    <>
    <div className="cards__container">
          {animeList.length === 0 ? (
            <h1>No se han encontrado animes</h1>
          ) : (
            animeList.map((anime: any) => (
              <div key={anime.user.AnimeID} className="anime__card" onClick={() => navigate(`/anime/${anime.user.animeID}`)}>
                <h1>{anime.api.title}</h1>
                <img src={anime.api.images}/>
                <div className="information__container">
                  <h2>Score: {anime.api.score}</h2>
                  <h2>Episodes: {anime.api.episodes}</h2>
                  <h3>My Status: {anime.user.status}</h3>
                  <h3>My Score: {anime.user.scorePersonal}</h3>
                  <h3>Watched: {anime.user.episodesWatched}</h3>
                </div>
              </div>
            ))
          )}
          </div>
    </>
)
}

export default MyListPage;