import { useState } from "react";
import type { UserAnimeEditDataType, UserAnimeListFirestoreType } from "../firebase/services/firestoreService.type";

export function useAnimeModal() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [animeId, setAnimeId] = useState<number | null>(null);
  const [animeEpisodes, setAnimeEpisodes] = useState<number>(1)
  const [action, setAction] = useState<"add" | "edit">("add");
  const [infoDocIdFromUser, setInfoDocIdFromUser] = useState<UserAnimeEditDataType | null> (null)

  const openModal = (animeId:number, animeEpisodes:number, userData?: UserAnimeListFirestoreType) =>{
    
    setIsOpen(true);
    setAnimeId(animeId);
    setAnimeEpisodes(animeEpisodes)

    if (!userData) {
      setAction("add");
      setInfoDocIdFromUser(null);
      return;
    }

    setAction("edit");
    setInfoDocIdFromUser({
      docId: userData.docId,
      status: userData.statusPersonal,
      score: userData.scorePersonal,
      episodes: userData.episodesWatched,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setAnimeId(null);
    setInfoDocIdFromUser(null);
  };

  return {
    isOpen,
    animeId,
    animeEpisodes,
    action,
    infoDocIdFromUser,
    openModal,
    closeModal,
  };
}
