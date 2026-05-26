import { removeAnimeFavorite } from "../../../firebase/services/user-information.firebase";
import type { AnimeCardType } from "../../../services/anime-list/anime-list.type";

type PropsModal = {
  listFavoriteInformation: AnimeCardType[];
  userId: string;
  onClose: () => void;
};

export const ModalRemoveFavorites = ({listFavoriteInformation, userId, onClose}:PropsModal) => {
  
  const deleteToFavorite = async (animeId: number, userId: string) => {
      try{
        await removeAnimeFavorite(animeId, userId)
      }catch{
  
      }finally{
  
      }
      onClose()
    }

  return (
    <div className="bg-popup">
      <div className="popup__container">
        <h3>Edit your favorites</h3>
        <div>
          {listFavoriteInformation.map((anime: AnimeCardType) => (
            <div key={anime.id} className="anime-search__card">
              <img className="anime-search__card-img" src={anime.image} />
              <p>{anime.title}</p>
              <button
                className="btn"
                onClick={() => deleteToFavorite(anime.id, userId)}
              >
                Remove from favorites
              </button>
            </div>
          ))}
        </div>

        <button
          className="btn btn--secondary"
          onClick={onClose}
        >
          Close{" "}
        </button>
      </div>
    </div>
  );
};
