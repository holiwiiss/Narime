import { useEffect, useRef, useState } from "react";
import "./search-anime.scss"
import { Link, useNavigate } from "react-router-dom";
import ErrorComponent from "../error-component/error-component";
import LoadingComponent from "../loading-component/loading-component";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useDebounce } from "../../hooks/use-debounce";
import { useAnimeSearch } from "../../hooks/use-anime-search";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchAnimeComponent = ({ isOpen, onClose }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null >(null)
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState("");
  const debounceInput = useDebounce(inputValue, 300)
  const { isLoading, isError, searchList, totalItems } = useAnimeSearch(debounceInput)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setInputValue("")
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key !== "Enter") return 
    onClose()
    navigate(`/search/anime?q=${debounceInput}`)
  }

  return (
    <div className={`search-input-wrap ${isOpen ? 'open' : ''}`} ref={wrapperRef}>
      <label htmlFor="anime-search" className="visually-hidden">Search anime</label>
      <input
        id="anime-search"
        ref={inputRef}
        autoFocus
        type="text"
        onKeyDown={(e) => handleSearch(e)}
        className="text-p buscar__anime"
        value={inputValue}
        onInput={(event: React.InputEvent<HTMLInputElement>) =>
          setInputValue(event.currentTarget.value)
        }
        placeholder="Search an anime..."
      ></input>

      {debounceInput.length > 0 && (
        <div role="listbox" aria-label="Search results" className="surface all-search__content">
          {isLoading ? (
            <LoadingComponent size="small" />
          ) : isError ? (
            <ErrorComponent text="Something went wrong" size="small"/>
          ): searchList.length === 0 ? (
            <ErrorComponent text="Not found anime with that name" size="small" /> 
          ) : (
            <>
            {searchList.map((anime: AnimeCardType) => (
              <Link role="option" to={`/anime/${anime.id}`} key={anime.id} className="anime-search__card" onClick={() => onClose()}>
                <img className="anime-search__card-img" src={anime.image} alt={anime.title}/>
                <p className="text-p anime-search__card-tittle">{anime.title}</p>
              </Link>
            ))}
            <Link to={`/search/anime?q=${debounceInput}`} className="btn btn--small btn-search-more" onClick={() => onClose()}> View More ({totalItems})</Link>
            </>
          )}
        </div>
      )}
      </div>
  );
};

export default SearchAnimeComponent;
