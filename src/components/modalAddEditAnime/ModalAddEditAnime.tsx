import { useState } from "react";
import { useAddAnimeList } from "../../context/MyListContext";
import type { AnimePersonalStatusType } from "../../firebase/services/firestoreService.type";

type PropsModalAdd = {
  animeId: number;
  action: "add" | "edit";
  onClose: () => void;
}

const ModalAddEditAnime = ({animeId, action, onClose} :PropsModalAdd) => {
  const { addAnimeToMyList } = useAddAnimeList()

  const headerText = action === "add" ? "Add to my list" : "Edit anime";

  const [selectedStatus, setSelectedStatus] = useState<AnimePersonalStatusType>("watching");
  const statusList = ["watching", "completed", "dropped", "planToWatch"];

  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [selectedEpisodes, setSelectedEpisodes] = useState<number>(0);

  const sendAction = (id:number, status: AnimePersonalStatusType, score: number | null, episodes: number) => {
    if(action==="add"){
      addAnimeToMyList(id, status, score, episodes)
    }else if(action === "edit"){

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
          <option value="">Status</option>
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
        ></input>

        <button type="button" onClick={() =>sendAction(animeId, selectedStatus, selectedScore, selectedEpisodes)}>Añadir</button>
        <button type="button" onClick={onClose}>Cerrar</button>
      </form>
    </div>
  );
};

export default ModalAddEditAnime;
