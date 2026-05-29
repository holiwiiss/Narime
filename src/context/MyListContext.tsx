import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./authContext";

import type { AnimePersonalStatusType, UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type";
import { addAnimeToFirebase, deleteAnimeInformationFirebase, getAllAnimesFirebase, updateAnimeInformationFirebase } from "../firebase/services/list-methods.firebase";

type MyListContextType = {
  myList: UserAnimeListFirestoreType[];
  isLoading: boolean;

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

type ProviderProps = {
  children: ReactNode;
};

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export function MyListProvider({ children }: ProviderProps) {

  const { user } = useAuth()
  const [myList, setMyList] = useState<UserAnimeListFirestoreType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    if(user){
      refetchMyList()
    }else{
      setMyList([])
    }
  }, [user])

  const refetchMyList = async () =>{
    if (!user) return;
    setIsLoading(true);
    const data = await getAllAnimesFirebase(user.uid);
    setMyList(data);
    setIsLoading(false);
  }

  const addAnimeToMyList = async (animeId: number, animeTitle: string, status: AnimePersonalStatusType, score: number | null, episodes: number) => {
    
    if(!user) return
    await addAnimeToFirebase(animeId, animeTitle, status, score, episodes, user.uid)
    await refetchMyList()
  };

  const editAnimeToMyList = async (docId: string, status: AnimePersonalStatusType, score: number | null, episodes: number) => {
    if(!user) return
    await updateAnimeInformationFirebase(docId, status, score, episodes)
    await refetchMyList()
  }

  const deleteAnimeToMyList = async (docId: string) => {
    if(!user) return 
    await deleteAnimeInformationFirebase(docId)
    await refetchMyList()
  }

  return (
    <MyListContext.Provider value={{myList, isLoading, addAnimeToMyList, editAnimeToMyList, deleteAnimeToMyList }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyAnimeList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("Algo estas haciendo mal");
  }
  return context;
}
