import { Link } from 'react-router'
import MaterialIcon from '../MaterialIcon'
import { ROUTES } from '../../consts/ROUTES'
import { useTranslation } from 'react-i18next'
import { IAppListItem } from '@/types/IAppListItem'
import AppIcon from './AppIcon'
import AppDownloadCount from './AppDownloadCount'

export default function AppItemSmall(props: IAppListItem) {
  const { t } = useTranslation()
  return (
    <Link
      to={`${ROUTES.APP_DETAIL}?pwaId=${props.id}`}
      className='flex flex-row gap-4 w-full md:w-1/2 lg:w-1/2'
    >
      <AppIcon iconImage={props.iconImage} name={props.name} />
      <div className='flex flex-col py-1'>
        <div className='font-bold line-clamp-2'>{props.name}</div>
        <div className='text-sm'>
          {props.categories.length ? props.categories[0].name : 'No category'}
        </div>
        {props.installed ? (
          <div className='flex flex-row items-center text-sm py-1'>
            <span className='font-bold text-sm'>{t('Installed')}</span>
            <MaterialIcon name='download_done' size='1.2rem' />
          </div>
        ) : (
          <AppDownloadCount
            downloadCount={props.downloadCount}
            installed={props.installed}
          />
        )}
      </div>
    </Link>
  )
}
