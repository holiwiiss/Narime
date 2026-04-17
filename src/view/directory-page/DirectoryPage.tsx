import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./directorypage.scss";
import type { AnimeListResponse, AnimeListType } from "../../services/anime-list/anime-list.type";
import { getSeasonalAnimes, getTopAnime, getTrendingAnimes } from "../../services/anime-list/anime-list";
import type { AnimeGenresType } from "../../services/anime-genres/anime-genres.type";
import { getAnimeGenres } from "../../services/anime-genres/anime-genres";

const DirectoryPage = () => {
  const [animeList, setAnimeList] = useState<AnimeListType[]>([]);
  const [myList, setMyList] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState <"top" | "trending" | "seasonal">("top")
  const [actualPage, setActualPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const navigate = useNavigate()

  const [selected, setSelected] = useState("");
  const [genresList, setGenresList] = useState<AnimeGenresType[]>([])
  const yearList = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990]
  const typeList = ['tv', 'movie', 'ova', 'special', 'ona']
  
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

    const loadGenres = async () => {
      try{
        const JSONGenres : AnimeGenresType[] = await getAnimeGenres()
        setGenresList(JSONGenres);
      }catch(err){
        console.log('La api no responde,' + err)
      }
    }
    loadGenres()
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

      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Genre</option>

        {genresList.map((genre) => (
          <option value={genre.name}>
            {genre.name}
          </option>
        ))}

      </select>

      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Year</option>

        {yearList.map((year) => (
          <option value={year}>
            {year}
          </option>
        ))}
        
      </select>

      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Type</option>

        {typeList.map((type) => (
          <option value={type}>
            {type}
          </option>
        ))}
        
      </select>

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
