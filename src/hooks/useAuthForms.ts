import { useNavigate } from "react-router-dom";
import { deleteUserFromFirebase, loginFirebase, loginWithGoogle, registerFirebase } from "../firebase/services/authService";
import { addUserToFirestore } from "../firebase/services/user-information.firebase";
import { useState } from "react";
import type { User } from "firebase/auth";

export const useAuthForms = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const registerInFirestore = async (user: User, email: string, username: string) => {
    try {
      await addUserToFirestore(user.uid, email, username)
      navigate("/login");
    } catch {
      await deleteUserFromFirebase(user);
      setIsError(true)
    }
  }

  const registerWithEmail = async (email:string , password:string, username: string) => {
    setIsLoading(true)
    setIsError(false)
    try{
      const user = await registerFirebase(email, password);
      
      if(user){
        await registerInFirestore(user, email, username)
      }
    }catch(e){
      setIsError(true)
    }finally{
      setIsLoading(false)
    }
  }

  const registerWithGoogle = async () => {
    setIsLoading(true)
    setIsError(false)
    try{
      const user = await loginWithGoogle();
      if (user) {
        await registerInFirestore(user, user.email ?? "", user.displayName ?? "User");
      }
    }catch(e){
      setIsError(true)
    }finally{
      setIsLoading(false)
    }
  }

  const logInWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    setIsError(false)
    try{
      const user = await loginFirebase(email, password)
      console.log("Sesión iniciada en: " + user)
      navigate("/directory")
    }catch{
      setIsError(true)
    }finally{
      setIsLoading(false)
    }
  }

  return { registerWithEmail, registerWithGoogle, logInWithEmail, isLoading, isError };
};
