import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { addAnimeToFirebase, isInList, updateAnimeInformationFirebase } from "../firebase/services/firestoreService";

type MyListContextType = {
  addAnimeToMyList: (
    id: number,
    status: string,
    score: number | null,
    episodes: number,
  ) => void;

  editAnimeToMyList: (
    id: string,
    status: string,
    score: number | null,
    episodes: number,
  ) => void;
};

type ProviderProps = {
  children: ReactNode;
};

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({ children }: ProviderProps) {

  const { user } = useAuth()

  const addAnimeToMyList = async (AnimeId: number, status: string, score: number | null, episodes: number) => {
    
    if(!user) return
    
    if(await isInList(AnimeId, user.uid)) return
    
    addAnimeToFirebase(AnimeId, status, score, episodes, user.uid)
  };

  const editAnimeToMyList = async (docId: string, status: string, score: number | null, episodes: number) => {
    if(!user) return
    updateAnimeInformationFirebase(docId,status, score, episodes)
  }

  return (
    <MyListContext.Provider value={{addAnimeToMyList, editAnimeToMyList }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useAddAnimeList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("Algo estas haciendo mal");
  }
  return context;
}
