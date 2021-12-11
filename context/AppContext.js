import { createContext, useContext } from 'react'

const AppContext = createContext()
export function useAppContext () {
  return useContext(AppContext)
}
export function ContextWrapper ({ children }) {
  const sharedState = {
    showTitleBool: false
  }
  return (
    <AppContext.Provider value={{ sharedState }}>
      {children}
    </AppContext.Provider>
  )
}
