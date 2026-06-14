import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { UserInformationFirestoreType } from "./firestore-service.type";

export async function addUserToFirestore(
  userID: string,
  email: string,
  username: string,
) {
  await setDoc(doc(db, "users", userID), {
    userID,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userID}`,
    description: "This user has started using Narime",
    email,
    followersCount: 0,
    followingCount: 0,
    username,
    animeFavs: [],
  });
}

export async function addAnimeFavorite(animeID:number, userId: string) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    animeFavs: arrayUnion(animeID)
  })
}

export async function updateUsername (userId:string, username:string) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    username,
  })
}

export async function updateBiografi (userId:string, description:string) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    description,
  })
}


export async function removeAnimeFavorite(animeID: number, userId: string) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    animeFavs: arrayRemove(animeID)
  })
}

export async function getUserInformation(
  userId: string,
): Promise<UserInformationFirestoreType | null> {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserInformationFirestoreType;
  } else {
    return null;
  }
}
