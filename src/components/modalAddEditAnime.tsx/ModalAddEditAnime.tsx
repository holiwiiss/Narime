import { useState } from "react";

const ModalAddEditAnime = (action: string) => {
  const [headerText, setHeaderText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const statusList = ["Watching", "Completed", "Dropped", "Plan To Watch"];

  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [selectedEpisodes, setSelectedEpisodes] = useState<number>(0);

  if (action === "add") {
    setHeaderText("Add to my list");
  } else if (action === "edit") {
    setHeaderText("Edit anime");
  }

  const sendAction = (status: string, score: number | null, episodes: number) => {
    if(action==="add"){
        
    }else if(action === "edit"){

    }
  }

  return (
    <div>
      <h1>{headerText}</h1>
      <form>
        <label>Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
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

        <button onClick={() =>sendAction(selectedStatus, selectedScore, selectedEpisodes)}></button>
      </form>
    </div>
  );
};

export default ModalAddEditAnime;
