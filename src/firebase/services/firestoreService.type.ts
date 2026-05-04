import type { Timestamp } from "firebase/firestore";

export type AnimePersonalStatusType = "watching" | "completed" | "dropped" | "planToWatch";

export type UserAnimeListFirestoreType = {
    docId: string
    animeId: number,
    statusPersonal: AnimePersonalStatusType,
    scorePersonal: number | null,
    episodesWatched: number,
    userId: string,
    updateAt: Timestamp, 
    createdAt: Timestamp, 
}

export type UserAnimeEditDataType = {
  docId: string;
  status: AnimePersonalStatusType;
  score: number | null;
  episodes: number;
};
