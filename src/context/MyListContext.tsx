import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { addAnimeToFirebase, isInList } from "../firebase/services/firestoreService";

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

  const addAnimeToMyList = async (AnimeId: number, status: string, score: number | null, episodes: number) => {
    
    if(!user) return
    
    if(await isInList(AnimeId, user.uid)) return
    
    addAnimeToFirebase(AnimeId, status, score, episodes, user.uid)
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
