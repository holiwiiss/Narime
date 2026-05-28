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

export type UserInformationFirestoreType = {
  userID:string;
  avatar: string,
  description: string,
  email: string, 
  followersCount: number,
  followingCount: number,
  username: string,
  animeFavs: number[],
}