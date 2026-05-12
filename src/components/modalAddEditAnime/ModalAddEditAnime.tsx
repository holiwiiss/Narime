import { useEffect } from "react";
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimePersonalStatusType, UserAnimeEditDataType } from "../../firebase/services/firestoreService.type";
import "./modalAddEditAnime.scss"
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

type PropsModal = {
  animeId: number;
  totalEpisodes: number;
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

const ModalAddEditAnime = ({animeId, totalEpisodes, action, infoDocIdUserAnime, onClose} :PropsModal) => {

  const { user } = useAuth()
  const { addAnimeToMyList, editAnimeToMyList, deleteAnimeToMyList } = useMyAnimeList()

  const statusList = ["watching", "completed", "dropped", "planToWatch"];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PopUpFormInputs>({
    defaultValues: {
      animeId,
      status: "watching",
      score: null,
      episodes: 0,
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
    if(data.status === "planToWatch") data.episodes = 0

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
            <h2>¿No estás logeado?</h2>
            <p>Inicia sesión para empezar a guardar tu progreso</p>
            <Link to="/login" className="bton">Iniciar sesión</Link>
          </>
        ):(
          <>
            <h3>{action === "add" ? "Add to my list" : "Edit anime"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="popUp_container_form">
              
              <label>Status</label>
              <select {...register("status")}>
                {statusList.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <label>Score</label>
              <input
                type="number"
                {...register('score',{
                  min:{value:0, message: '"No negative score'},
                  max: {value: 10, message:'Max score is 10'}
                })}
              ></input>
              {errors.score && <span>{errors.score.message}</span>}
              {(statusValue === "watching" || statusValue === "dropped") && (
                <>
                  <label>Episodes</label>
                  <input
                    type="number"
                    {...register('episodes',{
                      min:{value:0, message: 'No negative episodes'},
                      max: {value: totalEpisodes, message:'Too many episodes'}
                    })}
                  ></input>
                  {errors.episodes && <span>{errors.episodes.message}</span>}
                </>
              )}
              
              {action==="edit" && (
                <a href="#" onClick={deleteAnime} className="popup__delete-anime"> delete anime to the list</a>
              )}

              <button type="submit" className="btn">{action === "add" ? "Add" : "Edit"}</button>
              
            </form>
          </>
        )}
        <button type="button" className="btn btn--secondary" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalAddEditAnime;
