import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import type { UserAnimeListFirestoreType } from "./firestoreService.type";

/**
 * Añade un anime a la lista personal del usuario en Firestore
 *
 * Guarda SOLO los datos del usuario (no los datos de la API) en la colección: "userAnimeList"
 *
 * @param animeId - ID del anime (ID de Jikan / MyAnimeList)
 * @param status - Estado del anime para el usuario (watching, completed, dropped, etc)
 * @param score - Puntuación personal del usuario (0-10 o null)
 * @param episodes - Episodios vistos por el usuario
 * @param userId - UID del usuario autenticado en Firebase
 *
 * Estructura del documento guardado en Firestore:
 *
 * {
 *   animeId: number,
 *   statusPersonal: string,
 *   scorePersonal: number | null,
 *   episodesWatched: number,
 *   userId: string,
 *   updateAt: Date,
 *   createdAt: Date
 * }
 *
 */

export async function addAnimeToFirebase(animeId: number, status: string, score: number | null, episodes: number, userId: string): Promise<void> {
  try {
    await addDoc(collection(db, "userAnimeList"), {
      animeId,
      statusPersonal: status,
      scorePersonal: score,
      episodesWatched: episodes,
      userId,
      updateAt: new Date(),
      createdAt: new Date(),
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Comprueba si un anime YA existe en la lista del usuario
 *
 * Realiza una query en Firestore filtrando por:
 *   - animeId
 *   - userId
 *
 * Se usa para evitar duplicados en la lista.
 *
 * @param animeID - ID del anime
 * @param userID - UID del usuario autenticado
 *
 * @returns true  -> el anime ya está guardado
 * @returns false -> el anime NO está en la lista
 */

export async function isInList(animeId: number, userId: string): Promise<boolean> {
  try {
    const q = query( collection(db, "userAnimeList"), where("animeId", "==", animeId), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Obtiene TODOS los animes guardados por un usuario en Firestore
 *
 * Consulta la colección "userAnimeList" filtrando por userId.
 * Devuelve únicamente los datos personalizados del usuario.
 * (Los datos de la API se deben obtener después con Jikan)
 *
 * @param userId - UID del usuario autenticado
 *
 * @returns Array<UserAnimeListFirestoreType>
 *
 * Ejemplo de respuesta:
 *
 * animes = [
 *   { id: xyash23m, animeId: 5114, statusPersonal: "watching", scorePersonal: 9, episodesWatched: 12, userId: "uid123", updateAt: Date, createdAt: Date },
 *   { id: xyash23mz, animeId: 21, statusPersonal: "completed", scorePersonal: 10, episodesWatched: 24, userId: "uid123", updateAt: Date, createdAt: Date }
 * ]
 *
 */

export async function getAllAnimesFirebase(userId: string): Promise<UserAnimeListFirestoreType[]> {
  try {
    const q = query(collection(db, "userAnimeList"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const animes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserAnimeListFirestoreType[]
    console.log(animes)
    return animes;
  } catch (e) {
    console.log(e);
    return []
  }
}
