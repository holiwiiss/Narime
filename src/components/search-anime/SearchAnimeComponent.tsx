import { useEffect, useRef, useState } from "react";
import "./search-anime.scss"
import type {
  AnimeSearchResponse,
  AnimeSearchType,
} from "../../services/anime-search/anime-search.type";
import { searchAnime } from "../../services/anime-search/anime-search";

const SearchAnimeComponent = () => {
  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [animeToSearch, setAnimeToSeach] = useState<string>("");
  const [searchList, setSearchList] = useState<AnimeSearchType[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        if (activeSearch) {
          const JSON: AnimeSearchResponse = await searchAnime(animeToSearch);
          setSearchList(JSON.animes);
          setTotalItems(JSON.pagination.total_items);
        }
      } catch (err) {
        console.log("La api no responde, " + err);
      }
    };
    fetchAnimes();
  }, [activeSearch, animeToSearch]);

  const handleSearch = (text: string) => {
    console.log(text);

    if (!text || text==="") {
      setActiveSearch(false);
      setSearchList([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setActiveSearch(true);
      const encodedQuery = encodeURIComponent(text);
      setAnimeToSeach(encodedQuery);
    }, 500);
  };

  return (
    <>
    <div className="search__wrapper">
      <input
        type="text"
        className="buscar__anime"
        onInput={(event: React.InputEvent<HTMLInputElement>) =>
          handleSearch(event.currentTarget.value)
        }
        onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
          handleSearch(event.currentTarget.value)}
        onBlur={() => setActiveSearch(false)}
        placeholder="Search an anime..."
      ></input>

      {activeSearch && (
        <div className="all_busquedas__container">
          {searchList.length === 0 ? (
            <p>no se ha encontrado ningún anime con ese nombre</p>
          ) : (
            searchList.map((anime: AnimeSearchType) => (
              <div className="anime_search">
                <img src={anime.image} />
                <p>{anime.title}</p>
                <p>{anime.type}</p>
              </div>
            ))
          )}
          <button> View More ({totalItems})</button>
        </div>
      )}
      </div>
    </>
  );
};

export default SearchAnimeComponent;
