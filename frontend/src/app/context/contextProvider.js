import { createContext, useState, useEffect, useContext } from "react"
import { getCurrentUser } from "@/app/actions/getCurrentUser"

// Create a context for the user
const UserContext = createContext()

// Create a provider component
export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error("Failed to fetch current user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext)
}
