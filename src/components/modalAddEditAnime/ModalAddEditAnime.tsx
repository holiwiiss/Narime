import { useEffect, useState } from "react";
import { useMyAnimeList } from "../../context/MyListContext";
import type { AnimePersonalStatusType, UserAnimeEditDataType } from "../../firebase/services/firestoreService.type";

type PropsModal = {
  animeId: number;
  action: "add" | "edit";
  infoDocIdUserAnime: UserAnimeEditDataType | null;
  onClose: () => void;
}

const ModalAddEditAnime = ({animeId, action, infoDocIdUserAnime, onClose} :PropsModal) => {
  
  const { addAnimeToMyList, editAnimeToMyList } = useMyAnimeList()

  const statusList = ["watching", "completed", "dropped", "planToWatch"];
  const [selectedStatus, setSelectedStatus] = useState<AnimePersonalStatusType>("watching");
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [selectedEpisodes, setSelectedEpisodes] = useState<number>(0);

  useEffect(() => {
    if (action === "edit" && infoDocIdUserAnime) {
      setSelectedStatus(infoDocIdUserAnime.status)
      setSelectedScore(infoDocIdUserAnime.score)
      setSelectedEpisodes(infoDocIdUserAnime.episodes)
    }
  }, [action, infoDocIdUserAnime])

  const sendAction = (animeId:number, status: AnimePersonalStatusType, score: number | null, episodes: number) => {
    if(action==="add"){
      addAnimeToMyList(animeId, status, score, episodes)
    }else if(action === "edit"){
      if(!infoDocIdUserAnime) return
      editAnimeToMyList(infoDocIdUserAnime?.docId, status, score, episodes)
    }
    onClose();
  }

  return (
    <div>
      <h1>{action === "add" ? "Add to my list" : "Edit anime"}</h1>
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

        <button type="button" onClick={() =>sendAction(animeId, selectedStatus, selectedScore, selectedEpisodes)}>{action === "add" ? "Add" : "Edit"}</button>
        <button type="button" onClick={onClose}>Cerrar</button>
      </form>
    </div>
  );
};

export default ModalAddEditAnime;
