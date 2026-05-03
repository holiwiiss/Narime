import { useEffect, useState } from "react";
import { useAddAnimeList } from "../../context/MyListContext";
import type { AnimePersonalStatusType } from "../../firebase/services/firestoreService.type";

type UserAnimeEditData = {
  id: string
  status: AnimePersonalStatusType
  score: number | null
  episodes: number
}

type PropsModalAdd = {
  animeId: number;
  action: "add" | "edit";
  idUserList: UserAnimeEditData | null;
  onClose: () => void;
}

const ModalAddEditAnime = ({animeId, action, idUserList, onClose} :PropsModalAdd) => {
  const { addAnimeToMyList, editAnimeToMyList } = useAddAnimeList()

  const headerText = action === "add" ? "Add to my list" : "Edit anime";

  const [selectedStatus, setSelectedStatus] = useState<AnimePersonalStatusType>("watching");
  const statusList = ["watching", "completed", "dropped", "planToWatch"];

  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [selectedEpisodes, setSelectedEpisodes] = useState<number>(0);

  useEffect(() => {

    if(!idUserList) return

    if (action === "edit" && idUserList) {
      setSelectedStatus(idUserList.status)
      setSelectedScore(idUserList.score)
      setSelectedEpisodes(idUserList.episodes)
    }
  }, [action, idUserList])

  const sendAction = (id:number, status: AnimePersonalStatusType, score: number | null, episodes: number) => {
    if(action==="add"){
      addAnimeToMyList(id, status, score, episodes)
    }else if(action === "edit"){
      if(!idUserList) return
      editAnimeToMyList(idUserList?.id, selectedStatus, selectedScore, selectedEpisodes)
    }
    onClose();
  }

  return (
    <div>
      <h1>{headerText}</h1>
      <form>
        <label>Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as AnimePersonalStatusType)}
        >
          <option disabled  value="">Status</option>
          {statusList.map((status) => (
            <option value={status}>{status}</option>
          ))}
        </select>

        <label>Score</label>
        <input
          type="number"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedScore(Number(event.currentTarget.value))
          }
        ></input>

        <label>Episodes</label>
        <input
          type="number"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedEpisodes(Number(event.currentTarget.value))
          }
          placeholder={selectedEpisodes.toString()}
        ></input>

        <button type="button" onClick={() =>sendAction(animeId, selectedStatus, selectedScore, selectedEpisodes)}>{headerText}</button>
        <button type="button" onClick={onClose}>Cerrar</button>
      </form>
    </div>
  );
};

export default ModalAddEditAnime;
