import { useState } from 'react'
import { createContext, useContext } from 'react'

export const LanguageContext = createContext({
  language: null as string | null,
  setLanguage: (_languageData: string) => {},
})

export const useUserLanguage = () => useContext(LanguageContext)

export interface ICategoryProps {
  children: React.ReactNode
}

export const LanguageProvider = (props: ICategoryProps) => {
  const localLanguage = localStorage.getItem('language')
  const [language, setLanguage] = useState(localLanguage || 'ko')

  const setLanguageStorage = (languageCode: string) => {
    setLanguage(languageCode)
    localStorage.setItem('language', languageCode)
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: setLanguageStorage }}
    >
      {props.children}
    </LanguageContext.Provider>
  )
}
