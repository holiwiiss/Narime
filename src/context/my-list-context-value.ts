import { createContext } from "react";
import type { AnimePersonalStatusType, UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type";

type MyListContextType = {
  myList: UserAnimeListFirestoreType[];

  addAnimeToMyList: (
    id: number,
    animeTitle: string,
    status: AnimePersonalStatusType,
    score: number | null,
    episodes: number,
  ) => void;

  editAnimeToMyList: (
    docId: string,
    status: AnimePersonalStatusType,
    score: number | null,
    episodes: number,
  ) => void;

  deleteAnimeToMyList: (
    docId: string,
  ) => void;
};

export const MyListContext = createContext<MyListContextType | undefined>(undefined);