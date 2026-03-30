import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const registerFirebase = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error }
  }
};

const loginFirebase = async (email: string, password: string) => {
  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch(error:any){
    return { user: null, error }
  }
}

const loginWithGoogle = async () => {
  try{
    const userCredential = await signInWithPopup(auth, provider)
    return {user: userCredential.user, error: null}
  }catch(error:any){
    return {user:null, error}
  }
}

export { registerFirebase, loginFirebase, loginWithGoogle };