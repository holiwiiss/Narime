import React, { useState, useEffect, useRef } from "react";
import { getTopAnime, getSeasonalAnimes, getTrendingAnimes } from "../../api/animeList";
import "./directorypage.scss";
import type { AnimeListResponse, AnimeListType } from "../../types/api/animeListTyping";
import { useNavigate } from "react-router-dom";
import type { AnimeSearchResponse, AnimeSearchType } from "../../types/api/animeSearchTyping";
import { searchAnime } from "../../api/animeSearch";

const DirectoryPage = () => {
  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);
  const [myList, setMyList] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState <"top" | "trending" | "seasonal">("top")
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const navigate = useNavigate()
  const [activeSearch, setActiveSearch] = useState<"search" | null>(null)
  const [animeToSearch, setAnimeToSeach]= useState<string>("")
  const [searchList, setSearchList] = useState<AnimeSearchType[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

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

      try{
        if(activeSearch === "search"){
          const JSON: AnimeSearchResponse = await searchAnime(animeToSearch);
          setSearchList(JSON.animes);
          setTotalItems(JSON.pagination.total_items)
        }
      }catch(err){
        console.log('La api no responde, ' + err)
      }
    };
    fetchAnimes();
  }, [activeCategory, actualPage, activeSearch, animeToSearch]);

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

  const handleSearch = (text:string) =>{
    console.log(text)

    if(!text){
      setActiveSearch(null)
      setSearchList([])
      return
    }

    if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setActiveSearch('search')
      const encodedQuery = encodeURIComponent(text)
      setAnimeToSeach(encodedQuery)
    }, 500);
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

      <input type="text" className="buscar__anime" onInput={(event: React.InputEvent<HTMLInputElement>) => handleSearch(event.currentTarget.value)} placeholder="Search an anime..." ></input>

      {!activeSearch ? (
        <p>No se estan buscando animes</p>
      ):(
        <div>
        {searchList.length=== 0  ? (
          <p>no se ha encontrado ningún anime con ese nombre</p>
        ) : (
          searchList.map((anime: AnimeSearchType) => (
            <div className="anime_search">
              <img src={anime.image}/>
              <p>{anime.title}</p>
              <p>{anime.type}</p>
            </div>
          ))
          
        )}
          <button>View More ({totalItems})</button>
        </div>
      )}
    </>
  );
};


export default DirectoryPage;
