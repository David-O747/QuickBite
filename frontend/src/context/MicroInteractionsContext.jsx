import { createContext, useContext } from 'react'

const MicroInteractionsContext = createContext(true)

export function MicroInteractionsProvider({ enabled = true, children }) {
  return (
    <MicroInteractionsContext.Provider value={enabled}>
      {children}
    </MicroInteractionsContext.Provider>
  )
}

export function useMicroInteractions() {
  return useContext(MicroInteractionsContext)
}
