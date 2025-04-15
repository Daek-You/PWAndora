import { ROUTES } from '../../consts/ROUTES'
import logo from '@/assets/images/logos/logo.png'
import { useAuth } from '../../contexts/AuthContext'
import NavMenu from './NavMenu'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from '../form/LanguageDropdown'
import { useEffect, useState } from 'react'
import { useLanguage, usePatchLanguage } from '../../apis/auth'
import { useUserLanguage } from '../../contexts/LanguageContext'
import DropdownSkeleton from '../skeleton/DropdownSkeleton'
import i18n from '../../i18n'

const Header = () => {
  const { user, logout } = useAuth()
  const { language, setLanguage } = useUserLanguage()
  const [languageId, setLanguageId] = useState<number>(2)
  const { data: languages, isPending, isError } = useLanguage()

  console.log(languages)

  const route = useNavigate()
  const { t } = useTranslation()
  const { mutate } = usePatchLanguage()

  useEffect(() => {
    if (!language) return
    if (isPending || isError || !languages) return
    const found = languages.find(
      (lang: { code: string }) => lang.code === language,
    )
    if (found) setLanguageId(found.id)
  }, [language, languages])

  const handleLanguageChange = (langId: number) => {
    mutate(langId, {
      onSuccess: () => {
        setLanguageId(langId)
        const found = languages?.find(
          (lang: { id: number }) => lang.id === langId,
        )
        if (found) setLanguage(found.code)
        i18n.changeLanguage(localStorage.getItem('language') || 'ko')
      },
    })
  }

  const handleLogout = () => {
    // !TODO 로그아웃 api 호출
    logout()
    route(ROUTES.LOGIN)
  }

  const menus = user
    ? [
        {
          value: t('Dashboard'),
          to: ROUTES.DASHBOARD,
        },
        {
          value: t('App List'),
          to: ROUTES.APP,
        },
        {
          value: t('Crawler Status'),
          to: ROUTES.CRAWLER_STATUS,
        },
        {
          value: t('Confirmation'),
          to: ROUTES.CONFIRMATION,
        },
        {
          value: t('Logout'),
          onClick: handleLogout,
        },
      ]
    : [
        {
          value: t('Login'),
          to: ROUTES.LOGIN,
        },
      ]

  return (
    <div className='fixed flex flex-row justify-between items-center z-10 px-8 top-0 left-0 w-full h-16 bg-pwandora-white drop-shadow-md'>
      <div className='flex gap-6'>
        <Link to={ROUTES.DASHBOARD} className='flex gap-2 items-center'>
          <img src={logo} alt='logo-admin' className='size-8' />
          <div className='text-2xl font-bold text-gray-600'>PWAndora</div>
        </Link>
        {isPending || isError ? (
          <DropdownSkeleton hideLabel={true} />
        ) : (
          <LanguageDropdown
            value={languageId}
            onChange={handleLanguageChange}
            languages={languages}
            hideLabel={true}
          />
        )}
      </div>
      <div className='flex flex-row justify-center items-center gap-4 w-auto'>
        {menus.map(menu => (
          <NavMenu key={menu.value} {...menu} />
        ))}
      </div>
    </div>
  )
}

// !TODO 그림자 커스텀

export default Header
