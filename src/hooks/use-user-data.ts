import { useQuery } from "@tanstack/react-query"
import { getUserInformation } from "../firebase/services/user-information.firebase"
import { useAuth } from "./use-auth"

export const useUserData = () => {
  const { user } = useAuth()

  const {isLoading: isLoadingUser, isError: isErrorUser, data: userData = null} = useQuery({
    queryKey: ["userData", user?.uid],
    queryFn: () => getUserInformation(user!.uid),
    enabled: !!user,
  })
  return {isLoadingUser, isErrorUser, userData}
}

