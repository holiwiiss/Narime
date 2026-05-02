import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { addAnimeToFirebase, isInList } from "../firebase/services/firestoreService";

type ContentList = {
  animeID: number;
  animeStatus: string;
  animeScore: number | null;
  animeEpisodes: number;
};

type MyListContextType = {
  addAnimeToMyList: (
    id: number,
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

  const addAnimeToMyList = async (id: number, status: string, score: number | null, episodes: number) => {
    
    if(!user) return
    
    if(await isInList(id.toString(), user.uid)) return
    
    if(user){
      addAnimeToFirebase(Number(id), episodes, score, status, user.uid)
    }
  };

  return (
    <MyListContext.Provider value={{addAnimeToMyList }}>
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
