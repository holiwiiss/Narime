import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/auth-context"
import { getUserInformation } from "../firebase/services/user-information.firebase"

export const useUserData = () => {
  const { user } = useAuth()

  const {isLoading: isLoadingUser, isError: isErrorUser, data: userData = null} = useQuery({
    queryKey: ["userData", user?.uid],
    queryFn: () => getUserInformation(user!.uid),
    enabled: !!user,
  })
  return {isLoadingUser, isErrorUser, userData}
}

