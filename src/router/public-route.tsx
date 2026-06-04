import { Navigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  
  if (user) return <Navigate to="/" replace />
  
  return children
}

export default PublicRoute