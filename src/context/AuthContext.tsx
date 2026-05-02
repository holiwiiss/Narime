import { onAuthStateChanged, type User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider ({ children }: { children: React.ReactNode}){
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
        return context;
}