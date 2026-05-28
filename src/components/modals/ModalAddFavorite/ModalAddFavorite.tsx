import { useEffect, useState } from "react";
import type { AnimeCardType, AnimeListResponse } from "../../../services/anime-list/anime-list.type";
import { searchAnime } from "../../../services/anime-search/anime-search";
import { addAnimeFavorite } from "../../../firebase/services/user-information.firebase";

type PropsModal = {
  listFavoriteId: number[],
  userId:string
  onClose: () => void;
}

export const ModalAddFavorites = ({onClose, listFavoriteId, userId}: PropsModal) => {
  const [inputValue, setInputValue] = useState("");
  const [searchList, setSearchList] = useState<AnimeCardType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
      if (!inputValue) {
        setSearchList([]);
        return;
      }
    
      const timeout = setTimeout(async () => {
        setSearchList([])
        const query = encodeURIComponent(inputValue);
        try {
          const result: AnimeListResponse = await searchAnime(query, 1, 5);
          setSearchList(result.animes);
          console.log(searchList)
        } catch (e) {
          console.log("La api no responde, " + e);
        }finally{
        }
      }, 300);
  
      return () =>{clearTimeout(timeout);} 
    }, [inputValue]);

    const isInList = (animeId:number) =>{
    return listFavoriteId.includes(animeId)
  }

  const addToFavorite = async (animeId: number, userId: string) => {
      try{
        await addAnimeFavorite(animeId, userId)
      }catch{
  
      }finally{
  
    }
    onClose()
  }

  return (
    <>
      <div className="bg-popup">
        <div className="popup__container">
          <h3 className="text-h2">Add to favorites</h3>
          <input
            className="text-p"
            type="text"
            value={inputValue}
            onInput={(event: React.InputEvent<HTMLInputElement>) =>
              setInputValue(event.currentTarget.value)
            }
            placeholder="Search an anime..."
          ></input>
          <div>
            {isLoading ? (
              <h1 className="text-h2 text-color--75">Loading...</h1>
            ) : isError ? (
              <h1 className="text-h2 text-color--75" >Something went wrong</h1>
            ) : searchList.length === 0 ? (
              <p className="text-p text-color--75">No anime found with that name</p>
            ) : (
              searchList.map((anime: AnimeCardType) =>
                !isInList(anime.id) ? (
                  <div key={anime.id} className="anime-search__card">
                    <img
                      className="anime-search__card-img"
                      src={anime.image}
                    />
                    <p className="text-p">{anime.title}</p>
                    <button
                      className="btn"
                      onClick={() => addToFavorite(anime.id, userId)}
                    >
                      Add to favorites
                    </button>
                  </div>
                ) : (
                  <div key={anime.id} className="anime-search__card">
                    <img
                      className="anime-search__card-img"
                      src={anime.image}
                    />
                    <p className="text-p">{anime.title}</p>
                    <span className="text-p">Already in your favorites</span>
                  </div>
                ),
              )
            )}
          </div>

          <button
            className="btn btn--secondary"
            onClick={onClose}
          >
            Close{" "}
          </button>
        </div>
      </div>
    </>
  );
};
