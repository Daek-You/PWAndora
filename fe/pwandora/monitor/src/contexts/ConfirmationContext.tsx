import { createContext, useContext } from 'react'
import { IAppData } from '../types/confirmation'
import { IConfirmationRefs } from '../types/confirmationRefs'

interface ConfirmationContextProps {
  appData: IAppData
  setAppData: React.Dispatch<React.SetStateAction<IAppData | undefined>>
  refs: IConfirmationRefs
  dataSectionRef: React.RefObject<HTMLDivElement | null>
}

const ConfirmationContext = createContext<ConfirmationContextProps | undefined>(
  undefined,
)

export const ConfirmationProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: ConfirmationContextProps
}) => {
  return (
    <ConfirmationContext.Provider value={value}>
      {children}
    </ConfirmationContext.Provider>
  )
}

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error(
      'useConfirmation must be used within a ConfirmationProvider',
    )
  }
  return context
}
