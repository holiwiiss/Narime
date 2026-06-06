import { onAuthStateChanged, type User } from "firebase/auth"
import { useEffect, useState, type ReactNode } from "react";
import { auth } from "../firebase/firebase";
import { AuthContext } from "./auth-context-value";


export function AuthProvider ({ children }: { children: ReactNode}){
  const [user, setUser]= useState<User | null> (null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return(
    <AuthContext.Provider value={{user, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

