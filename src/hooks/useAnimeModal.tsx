import { useState } from "react";
import type { UserAnimeEditDataType, UserAnimeListFirestoreType } from "../firebase/services/firestoreService.type";

export function useAnimeModal() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [animeId, setAnimeId] = useState<number | null>(null);
  const [action, setAction] = useState<"add" | "edit">("add");
  const [infoDocIdFromUser, setInfoDocIdFromUser] = useState<UserAnimeEditDataType | null> (null)

  const openModal = (animeId:number, userData?: UserAnimeListFirestoreType) =>{
    
    setIsOpen(true);

    if (!userData) {
      setAction("add");
      setAnimeId(animeId);
      setInfoDocIdFromUser(null);
      return;
    }

    setAction("edit");
    setAnimeId(animeId);
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
    action,
    infoDocIdFromUser,
    openModal,
    closeModal,
  };
}
