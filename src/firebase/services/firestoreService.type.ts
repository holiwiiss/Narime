import type { Timestamp } from "firebase/firestore";

export type AnimePersonalStatusType = "watching" | "completed" | "dropped" | "planToWatch";

export type UserAnimeListFirestoreType = {
    id: string
    animeId: number,
    statusPersonal: AnimePersonalStatusType,
    scorePersonal: number | null,
    episodesWatched: number,
    userId: string,
    updateAt: Timestamp, 
    createdAt: Timestamp, 
}