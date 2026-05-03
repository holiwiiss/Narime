import type { Timestamp } from "firebase/firestore";

export type UserAnimeListFirestoreType = {
    id: string
    animeId: number,
    statusPersonal: string,
    scorePersonal: number | null,
    episodesWatched: number,
    userId: string,
    updateAt: Timestamp, 
    createdAt: Timestamp, 
}