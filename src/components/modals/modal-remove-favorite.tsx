import { toast } from "sonner";
import { removeAnimeFavorite } from "../../firebase/services/user-information.firebase";
import type { AnimeCardType } from "../../services/anime-list/anime-list.type";
import { useQueryClient } from "@tanstack/react-query";

type PropsModal = {
  listFavoriteInformation: AnimeCardType[];
  userId: string;
  onClose: () => void;
};

export const ModalRemoveFavorites = ({listFavoriteInformation, userId, onClose}:PropsModal) => {
  const queryClient = useQueryClient()

  const deleteToFavorite = async (animeId: number) => {
    try{
      await removeAnimeFavorite(animeId, userId)
      queryClient.invalidateQueries({ queryKey: ["userData"] })
      queryClient.invalidateQueries({ queryKey: ["myFavoriteList"] })
      toast.success("Anime remove from your favorites")
      onClose()
    }catch{
      toast.error("Something went wrong")
    } 
  }

  return (
    <div className="bg-popup" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="surface popup__container ">
        <h2 id="modal-title" className="text-h2">Edit your favorites</h2>
        <ul>
          {listFavoriteInformation.map((anime: AnimeCardType) => (
            <li key={anime.id} className="anime-favorite__card">
              <div className="anime-favorite__card-header">
                <img className="anime-search__card-img" src={anime.image} alt={anime.title}/>
                <p className="text-p anime-search__card-tittle">{anime.title}</p>
              </div>
              <button
                className="btn"
                onClick={() => deleteToFavorite(anime.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button
          className="btn btn--secondary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
