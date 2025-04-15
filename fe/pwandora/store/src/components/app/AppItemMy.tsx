import { Link } from 'react-router'
import MaterialIcon from '../MaterialIcon'
import { ROUTES } from '../../consts/ROUTES'
import { simpleLocaleNumber } from '../../utils/simpleLocaleNumber'
import { useTranslation } from 'react-i18next'
import { IAppListItem } from '@/types/IAppListItem'
import AppIcon from './AppIcon'
import AppInstallOpen from './AppInstallOpen'

export default function AppItemMy(appItemMy: IAppListItem) {
  const { t } = useTranslation()

  return (
    <Link
      to={`${ROUTES.APP_DETAIL}?pwaId=${appItemMy.id}`}
      className='py-3 px-6 flex flex-row grow gap-4'
    >
      <AppIcon iconImage={appItemMy.iconImage} name={appItemMy.name} />
      <div className='flex flex-col py-2 grow'>
        <div className='font-bold line-clamp-1'>{appItemMy.name}</div>
        <div className='text-sm'>
          {!!appItemMy.categories.length && appItemMy.categories[0].name}
        </div>

        {appItemMy.installed ? (
          <div className='flex flex-row items-center py-1 gap-1'>
            <span className='font-bold text-sm'>{t('Installed')}</span>
            <MaterialIcon name='download_done' size='1.2rem' />
          </div>
        ) : (
          <div className='flex flex-row items-center py-1 '>
            <span className='font-bold text-sm'>
              {simpleLocaleNumber(appItemMy.downloadCount)}
            </span>
            <MaterialIcon name='download' filled size='1.2rem' />
          </div>
        )}
      </div>
      <div className='flex items-center justify-end'>
        <AppInstallOpen appDetail={appItemMy} />
      </div>
    </Link>
  )
}
