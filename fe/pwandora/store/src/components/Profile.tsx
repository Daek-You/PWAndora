import { useAuth } from '@/contexts/AuthContext'
import MaterialIcon from './MaterialIcon'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/consts/ROUTES'
import { useLanguage } from '@/contexts/LanguageContext'
import Dropdown from './common/DropDown'
import { useTranslation } from 'react-i18next'
import { useChangeLanguage } from '@/apis/user'
import { useQueryClient } from '@tanstack/react-query'

export default function Profile() {
  const { logout, user } = useAuth()
  const route = useNavigate()
  const { availableLanguages, setLanguage } = useLanguage()
  const { t, i18n } = useTranslation()
  const { mutate: changeLanguage } = useChangeLanguage()
  const queryClient = useQueryClient()

  if (!user) {
    route(ROUTES.SIGNIN)
    return null
  }

  const handleLanguageChange = (language: { label: string; value: string }) => {
    const selectedLanguage = availableLanguages.find(
      lang => lang.code === language.value,
    )
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage.code)
      changeLanguage(selectedLanguage.id, {
        onSuccess: () => {
          console.log('Language changed successfully')
          queryClient.invalidateQueries({ queryKey: ['myApps'] }) // Invalidate the user query to refresh the data
        },
        onError: (error: any) => {
          console.error('Error changing language:', error)
        },
      })
      setLanguage(selectedLanguage)
    }
  }

  return (
    <section className='px-[4%] py-6 flex flex-row items-center justify-between bg-foreground-gray'>
      <div className='flex flex-row items-center gap-3'>
        <h1 className='size-24 p-4 flex items-center justify-center rounded-full text-3xl font-bold bg-foreground-bright'>
          {user.loginId.slice(0, 3).toUpperCase()}
        </h1>
        <p className='text-xl'>{user.loginId}</p>
      </div>
      <div className='flex items-end flex-col gap-4'>
        <button
          className='flex flex-row items-center bg-white rounded-full font-bold p-1.5 pl-3 gap-2'
          onClick={logout}
        >
          <span>{t('Log out')}</span>
          <MaterialIcon name='logout' size='1.4rem' />
        </button>
        <Dropdown
          title={t('Language')}
          options={availableLanguages.map(language => ({
            label: language.name,
            value: language.code,
          }))}
          onSelect={handleLanguageChange}
        />
      </div>
    </section>
  )
}
