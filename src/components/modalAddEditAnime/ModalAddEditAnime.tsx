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
            <h2>You're not logged in</h2>
            <p>Sign in to start saving your progress</p>
            <Link to="/login" className="bton">Sign in</Link>
          </>
        ):(
          <>
            <div className="popUp__container--header">
              <div className="popUp__container-header--title">
                <p>{action === "add" ? "Adding to my list" : "Editing"}</p>
                <h3 className="popUp__container-header--h3">{animeTitle}</h3>
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
              <label>Status</label>
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

              <label>Personal Score</label>
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
                  <label>Episodes</label>
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
                  <p> / {totalEpisodes} episodes</p>
                  </div>
                </>
              )}
              <div className="btn--popup-container">
                <button type="submit" className="btn">{action === "add" ? "Add" : "Edit"}</button>
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
