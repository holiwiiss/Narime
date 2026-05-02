import { db } from "../firebase";
import { collection, addDoc,  doc , getDoc,query, where, getDocs } from "firebase/firestore"; 

export async function addAnimeToFirebase (animeId:number, ep:number , sc:number | null, st: string, userId:any){
    try{
        await addDoc(collection(db, "userAnimeList"),{
            AnimeID: animeId,
            episodesWatched: ep,
            scorePersonal: sc,
            status: st,
            userID:userId,
            UpdatedAt: "3 de mayo de 2026 a las 12:00:00 a.m. UTC+2",
            createdAt: "3 de mayo de 2026 a las 12:00:00 a.m. UTC+2",
        })
    }catch (e){
        console.log(e)
    }
}

export async function isInList(animeID:string, userID: string) {
    try {
    const q = query(
      collection(db, "userAnimeList"),
      where("animeID", "==", animeID),
      where("userID", "==", userID)
    );

    const querySnapshot = await getDocs(q);

    // Si hay algún documento -> ya está en la lista
    return !querySnapshot.empty;

  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getAllAnimesFirebase(userID:string) {
    try{
        const q = query(collection(db, "userAnimeList"), where("userID", "==", userID))
        const querySnapshot = await getDocs(q);
        const animes = querySnapshot.docs.map(doc => ({
            id: doc.id,      
            ...doc.data()        
             }));
        console.log(animes)
        return animes
    }catch(e){
        console.log(e)
    }
}