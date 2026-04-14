import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./directorypage.scss";
import type { AnimeListResponse, AnimeListType } from "../../services/anime-list/anime-list.type";
import type { AnimeSearchResponse, AnimeSearchType } from "../../services/anime-search/anime-search.type";
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../../services/anime-list/anime-list";
import { searchAnime } from "../../services/anime-search/anime-search";

const DirectoryPage = () => {
  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);
  const [myList, setMyList] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState <"top" | "trending" | "seasonal">("top")
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const navigate = useNavigate()
 
  useEffect(() => {
    const fetchAnimes= async () => {
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
      }catch(err){
        console.log('La api no responde')
      }

    };
    fetchAnimes();
  }, [activeCategory, actualPage]);

  const activateFilter = (category: "top" | "trending" | "seasonal") => {
    setActiveCategory(category);
    setActualPage(1);
  }

  const addToMyList = (Animeid:number) => {
    setMyList(prevList => [...prevList, Animeid]);
    console.log(myList);
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
          <div className="anime__card" onClick={() => navigate(`/anime/${anime.id}`)}>
            <h1>{anime.title}</h1>
            <img src={anime.image}/>
            <div className="information__container">
              <h2>Score: {anime.score}</h2>
              <h2>Episodes: {anime.episodes}</h2>
            </div>
            <button onClick={() => addToMyList(anime.id)}> Add to list</button>
          </div>
        ))
      )}
      </div>

      <div className="pagination__container">
        <button  className={actualPage === 1 ? "btn__disable" : "btn__able"} onClick={() => previousPage()}>atras</button>
        <p>Página {actualPage} de {lastPage}</p>
        <button className={actualPage === lastPage ? "btn__disable" : "btn__able"} onClick={() => nextPage()}>siguiente</button>
      </div>

    </>
  );
};

export default DirectoryPage;
