import { useContext, createContext } from "react"
import { useState } from "react"

const Context = createContext()

const contextProvider = ({ children }) => {
  const [treeDat, setTreeDat] = useState([])

  return (
    <Context.Provider value={{ treeDat, setTreeDat }}>
      {children}
    </Context.Provider>
  )
}

const useGlobalContext = () => {
  return useContext(Context)
}

export { contextProvider, useGlobalContext, Context }
