import { useTranslation } from 'react-i18next'
import { ROUTES } from '../consts/ROUTES'
import FooterItem from './FooterItem'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className='flex justify-around bg-white w-full p-1'>
      <FooterItem icon='home' name={t('home')} link={ROUTES.HOME} />
      <FooterItem
        icon='category_search'
        name={t('search')}
        link={ROUTES.SEARCH}
      />
      <FooterItem icon='person' name={t('my apps')} link={ROUTES.MY_APPS} />
    </footer>
  )
}
