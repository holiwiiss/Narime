import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, deleteUser, type User } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const registerFirebase = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user
};

export const loginFirebase = async (email: string, password: string) => {
  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch(error:any){
    return { user: null, error }
  }
}

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, provider)
  return userCredential.user
}

export const logOutFirebase = async() => {
  await signOut(auth)
}

export const deleteUserFromFirebase = async (user: User) => {
  await deleteUser(user)
}