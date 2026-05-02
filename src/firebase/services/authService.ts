import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const registerFirebase = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error }
  }
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
  try{
    const userCredential = await signInWithPopup(auth, provider)
    return {user: userCredential.user, error: null}
  }catch(error:any){
    return {user:null, error}
  }
}

export const logOutFirebase = async() => {
  await signOut(auth)
}