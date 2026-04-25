import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./directorypage.scss";
import type { AnimeListResponse, AnimeListType } from "../../services/anime-list/anime-list.type";
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../../services/anime-list/anime-list";
import Pagination from "../../components/pagination/Pagination";
import LoadingComponent from "../../components/loading/LoadingComponent";
import ErrorComponent from "../../components/error/ErrorComponent";
import { useAddAnimeList } from "../../context/MyListContext";

const DirectoryPage = () => {

  const navigate = useNavigate()
  const { addAnimeToMyList } = useAddAnimeList()

  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);

  const [activeCategory, setActiveCategory] = useState <"top" | "trending" | "seasonal">("top")
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const fetchAnimes= async () => {
      setIsLoading(true)
      setIsError(false)
      try{
        if(activeCategory === "top"){
          const JSON: AnimeListResponse = await getTopAnime(actualPage);
          setAnimeList(JSON.animes);
          setLastPage(JSON.pagination.last_visible_page);
        }

        if(activeCategory === "trending"){
          const JSON: AnimeListResponse = await getTrendingAnimes(actualPage);
          setAnimeList(JSON.animes);
          setLastPage(JSON.pagination.last_visible_page);
        }

        if(activeCategory === "seasonal"){
          const JSON: AnimeListResponse = await getSeasonalAnimes(actualPage);
          setAnimeList(JSON.animes);
          setLastPage(JSON.pagination.last_visible_page);
        }
      }catch(e){
        console.log('La api no responde, ' + e)
        setIsError(true)
      }finally {
        setIsLoading(false)
      }
    };
    fetchAnimes();
  }, [activeCategory, actualPage]);

  if (isLoading) return <LoadingComponent text="Cargando animes..." />
  if (isError) return <ErrorComponent text="Ha habido un error con la API" />

  const activateFilter = (category: "top" | "trending" | "seasonal") => {
    setActiveCategory(category);
    setActualPage(1);
    console.log('aa')
  }

  const addAnime = (e: React.MouseEvent<HTMLButtonElement>, animeId:number) => {
    e.stopPropagation();
    addAnimeToMyList(animeId)
  }

  const nextPage = () => {
    if(actualPage >= lastPage) {
      return;
    }
    setActualPage(prev => prev + 1)
  }
  
  const previousPage = () => {
    if(actualPage > 1){
      setActualPage(prev => prev - 1);
    }
  }

  return (
    <>
    <div className="bton__container">
      <button className={activeCategory === 'trending' ? "bton btn__able" : " bton btn__disable "} onClick={() => activateFilter("trending")}>Trending</button>
      <button className={activeCategory === 'top' ? "bton btn__able" : " bton btn__disable"} onClick={() => activateFilter("top")}>Top 100</button>
      <button className={activeCategory === 'seasonal' ? "bton btn__able" : " bton btn__disable"} onClick={() => activateFilter("seasonal")}>Seasonal</button>
    </div>

    <div className="cards__container">
      {animeList.length === 0 ? (
        <h1>No se han encontrado animes</h1>
      ) : (
        animeList.map((anime: AnimeListType) => (
          <div key={anime.id} className="anime__card" onClick={() => navigate(`/anime/${anime.id}`)}>
            <h1>{anime.title}</h1>
            <img src={anime.image}/>
            <div className="information__container">
              <h2>Score: {anime.score}</h2>
              <h2>Episodes: {anime.episodes}</h2>
            </div>
            <button onClick={(e) => addAnime(e, anime.id)}> Add to list</button>
          </div>
        ))
      )}
      </div>

      <Pagination actualPage={actualPage} lastPage={lastPage} onNextPage={nextPage} onPreviousPage={previousPage}></Pagination>
    </>
  );
};

export default DirectoryPage;
