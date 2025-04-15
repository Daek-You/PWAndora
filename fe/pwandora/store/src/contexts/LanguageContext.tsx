import { useLanguages } from '@/apis/app'
import { createContext, useContext, useState, ReactNode } from 'react'
import { useEffect } from 'react'

type Language = {
  id: number
  name: string
  code: string
} // Dynamic languages fetched from the server

interface LanguageContextProps {
  language: Language
  setLanguage: (language: Language) => void
  availableLanguages: Language[]
}

const english: Language = { id: 1, name: 'English', code: 'en' }

const LanguageContext = createContext({
  language: english,
  setLanguage: (_language: Language) => {},
  availableLanguages: [] as Language[],
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const storedLanguageCode = localStorage.getItem('i18nextLng')

  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([])
  const [language, setLanguage] = useState<Language>(english)
  const { data: languages } = useLanguages()

  const getLanguageByCode = (code: string | null) => {
    if (!code) return null
    return availableLanguages.find(language => language.code === code)
  }

  useEffect(() => {
    if (!availableLanguages.length) return
    if (storedLanguageCode) {
      const storedLanguage = getLanguageByCode(storedLanguageCode)
      if (storedLanguage) setLanguage(storedLanguage)
    }
  }, [availableLanguages])

  useEffect(() => {
    if (languages) setAvailableLanguages(languages)
  }, [languages])

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, availableLanguages }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
