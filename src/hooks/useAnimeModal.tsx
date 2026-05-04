import { useState } from "react";
import type { UserAnimeEditDataType, UserAnimeListFirestoreType } from "../firebase/services/firestoreService.type";

export function useAnimeModal() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<"add" | "edit">("add");
  const [infoDocIdFromUser, setInfoDocIdFromUser] = useState<UserAnimeEditDataType | null> (null)

  const openModal = (animeId:number, userData?: UserAnimeListFirestoreType) =>{
    
    setIsOpen(true);

    if (!userData) {
      setSelectedAction("add");
      setSelectedAnimeId(animeId);
      setInfoDocIdFromUser(null);
      return;
    }

    setSelectedAction("edit");
    setInfoDocIdFromUser({
      docId: userData.docId,
      status: userData.statusPersonal,
      score: userData.scorePersonal,
      episodes: userData.episodesWatched,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedAnimeId(null);
    setInfoDocIdFromUser(null);
  };

  return {
    isOpen,
    selectedAnimeId,
    selectedAction,
    infoDocIdFromUser,
    openModal,
    closeModal,
  };
}
