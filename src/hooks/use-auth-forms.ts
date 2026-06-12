import { useNavigate } from "react-router-dom";
import { deleteUserFromFirebase, loginFirebase, loginWithGoogle, registerFirebase } from "../firebase/services/auth-service.firebase";
import { addUserToFirestore } from "../firebase/services/user-information.firebase";
import { useState } from "react";
import type { User } from "firebase/auth";
import { toast } from "sonner";

export const useAuthForms = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const registerInFirestore = async (user: User, email: string, username: string) => {
    try {
      await addUserToFirestore(user.uid, email, username)
      toast.success("user create correctly")
      navigate("/login");
    } catch {
      await deleteUserFromFirebase(user);
      toast.error("Something went wrong")
      setIsError(true)
    }
  }

  const registerWithEmail = async (email:string , password:string, username: string) => {
    setIsLoading(true)
    setIsError(false)
    try {
      const user = await registerFirebase(email, password);
      if(user){
        await registerInFirestore(user, email, username)
        navigate("/directory")
        toast.success("user create correctly")
      }
    }catch {
      toast.error("Something went wrong")
      setIsError(true)
    }finally{
      setIsLoading(false)
    }
  }

  const registerWithGoogle = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setIsError(false)
    try{
      const user = await loginWithGoogle();
      if (user) {
        await registerInFirestore(user, user.email ?? "", user.displayName ?? "User");
        navigate("/directory")
        toast.success("user create correctly")
      }
    } catch {
      setIsError(true)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const logInWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    setIsError(false)
    try{
      await loginFirebase(email, password)
      toast.success("user login correctly")
      navigate("/directory")
    } catch {
      setIsError(true)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return { registerWithEmail, registerWithGoogle, logInWithEmail, isLoading, isError };
};
