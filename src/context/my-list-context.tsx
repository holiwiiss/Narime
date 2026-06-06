import {useCallback, type ReactNode } from "react";
import type { AnimePersonalStatusType, UserAnimeListFirestoreType } from "../firebase/services/firestore-service.type";
import { addAnimeToFirebase, deleteAnimeInformationFirebase, getAllAnimesFirebase, updateAnimeInformationFirebase } from "../firebase/services/list-methods.firebase";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/use-auth";
import { MyListContext } from "./my-list-context-value";

export function MyListProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const { data: myList = [], refetch } = useQuery<UserAnimeListFirestoreType[]>({
    queryKey: ["myList", user?.uid],
    queryFn: () => getAllAnimesFirebase(user!.uid),
    enabled: !!user,
  })

  const addAnimeToMyList = useCallback(async (animeId: number, animeTitle: string, status: AnimePersonalStatusType, score: number | null, episodes: number) => {
    if(!user) return
    try{
      await addAnimeToFirebase(animeId, animeTitle, status, score, episodes, user.uid)
      refetch()
      toast.success("Anime added to your list")
    }catch{
      toast.error("Something went wrong")
    }
  }, [user, refetch]);

  const editAnimeToMyList = useCallback( async (docId: string, status: AnimePersonalStatusType, score: number | null, episodes: number) => {
    if(!user) return
    try{
      await updateAnimeInformationFirebase(docId, status, score, episodes)
      refetch()
      toast.success("Anime edited")
    }catch{
      toast.error("Something went wrong")
    }
  }, [user, refetch])

  const deleteAnimeToMyList = useCallback(async (docId: string) => {
    if(!user) return 
    try{
      await deleteAnimeInformationFirebase(docId)
      refetch()
      toast.success("Anime remove correctly")
    }catch{
      toast.error("Something went wrong")
    }
  }, [user, refetch])

  return (
    <MyListContext.Provider value={{myList, addAnimeToMyList, editAnimeToMyList, deleteAnimeToMyList }}>
      {children}
    </MyListContext.Provider>
  );
}
