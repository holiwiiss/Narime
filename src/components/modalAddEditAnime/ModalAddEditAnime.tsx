import { useEffect, useState } from "react";
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimePersonalStatusType, UserAnimeEditDataType } from "../../firebase/services/firestoreService.type";
import "./modalAddEditAnime.scss"
import { useForm, Controller , type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import EpisodesInput from "../episodesInput/EpisodesInput";
import StatusSelector from "../statusSelector/StatusSelector";
import StarRating from "../starRating/StarRating";
import OptionsPopUp from "../optionsPopUp/OptionsPopUP";

type PropsModal = {
  animeId: number;
  totalEpisodes: number;
  animeTitle: string;
  action: "add" | "edit";
  infoDocIdUserAnime: UserAnimeEditDataType | null;
  onClose: () => void;
}

export interface PopUpFormInputs {
  animeId:number, 
  status: AnimePersonalStatusType, 
  score: number | null, 
  episodes: number
}

const ModalAddEditAnime = ({animeId, totalEpisodes, animeTitle, action, infoDocIdUserAnime, onClose} :PropsModal) => {

  const { user } = useAuth()
  const { addAnimeToMyList, editAnimeToMyList, deleteAnimeToMyList } = useMyAnimeList()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const {
    handleSubmit,
    watch,
    reset,
    control,
  } = useForm<PopUpFormInputs>({
    defaultValues: {
      animeId,
      status: "watching",
      score: null,
      episodes: 1,
    }
  });
  
  const onSubmit: SubmitHandler<PopUpFormInputs> = (data) => {
    sendAction(data)
  }

  useEffect(() => {
    if (action === "edit" && infoDocIdUserAnime) {
      reset({
        animeId,
        status: infoDocIdUserAnime.status,
        score: infoDocIdUserAnime.score,
        episodes: infoDocIdUserAnime.episodes,
      });
    }

  }, [action, infoDocIdUserAnime, animeId, reset])
  
  const statusValue = watch("status");

  const sendAction = (data:PopUpFormInputs) =>{
    if(data.status === "completed") data.episodes = totalEpisodes
    if(data.status === "planToWatch") data.episodes = 1

    if(action === "add"){
      addAnimeToMyList(animeId, data.status, data.score, data.episodes);
    } else {
      if(!infoDocIdUserAnime) return
      editAnimeToMyList(infoDocIdUserAnime?.docId, data.status, data.score, data.episodes)
    }
    onClose();
  }

  const deleteAnime = () => {
    if(!infoDocIdUserAnime) return
    deleteAnimeToMyList(infoDocIdUserAnime?.docId)
    onClose();
  }

  return (
    <div className="bg-popup">
      <div className="popup__container">
        {!user ? (
          <>
            <h2 className="text-h2">You're not logged in</h2>
            <p className="text-p text-color--75">Sign in to start saving your progress</p>
            <Link to="/login" className="bton">Sign in</Link>
          </>
        ):(
          <>
            <div className="popUp__container--header">
              <div className="popUp__container-header--title">
                <p className="text-p text-color--75">{action === "add" ? "Adding to my list" : "Editing"}</p>
                <h3 className="text-h2">{animeTitle}</h3>
              </div>
              {action==="edit" && (
                <>
                <button className="btn btn--secondary btn--small" onClick={() => setIsOptionsOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 icon-size-m icon-options-pop-up">
                    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                  </svg>
                </button>
                {isOptionsOpen && (<OptionsPopUp isOpen={isOptionsOpen} onClose={()=> setIsOptionsOpen(false)} onDelete={deleteAnime}/>)}
                </>
              )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="popUp_container_form"> 
              <label className="text-details">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <StatusSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <label className="text-details">Personal Score</label>
              <Controller
                name="score"
                control={control}
                render={({ field }) => (
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {(statusValue === "watching" || statusValue === "dropped") && (
                <>
                  <label className="text-details">Episodes</label>
                  <div className="episodes-row">
                  <Controller
                    name="episodes"
                    control={control}
                    render={({ field }) => (
                      <EpisodesInput
                        value={field.value}
                        onChange={field.onChange}
                        max={totalEpisodes}
                      />
                    )}
                  />
                  <p className="text-details text-color--75"> / {totalEpisodes} episodes</p>
                  </div>
                </>
              )}
              <div className="btn--popup-container">
                <button type="submit" className="btn">Save</button>
                <button type="button" className="btn btn--secondary" onClick={onClose}>Close</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalAddEditAnime;
