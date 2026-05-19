import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { UserInformationFirestoreType } from "./firestoreService.type";

export async function addUserToFirestore(
  userID: string,
  email: string,
  username: string,
) {
  await setDoc(doc(db, "users", userID), {
    userID,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userID}`,
    description: "Este usuario ha empezado a usar Narime",
    email,
    followersCount: 0,
    followingCount: 0,
    username,
    animeFavs: [],
  });
}

export async function getUserInformation(
  userId: string,
): Promise<UserInformationFirestoreType | null> {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data() as UserInformationFirestoreType;
  } else {
    console.log("No such document!");
    return null;
  }
}
