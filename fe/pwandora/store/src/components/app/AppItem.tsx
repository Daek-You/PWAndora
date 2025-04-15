import { Link } from 'react-router'
import MaterialIcon from '../MaterialIcon'
import { ROUTES } from '../../consts/ROUTES'
import { IAppListItem } from '@/types/IAppListItem'
import { useTranslation } from 'react-i18next'
import AppIcon from './AppIcon'
import AppDownloadCount from './AppDownloadCount'

export default function AppItem(props: IAppListItem) {
  const { t } = useTranslation()
  return (
    <Link
      to={`${ROUTES.APP_DETAIL}?pwaId=${props.id}`}
      className='py-3 px-[4%] flex flex-row grow gap-6'
    >
      <AppIcon iconImage={props.iconImage} name={props.name} size={20} />
      <div className='flex flex-col'>
        <div className='font-bold line-clamp-1'>{props.name}</div>
        <div className='flex flex-row items-center gap-1'>
          {!!props.categories.length && (
            <>
              <div className='text-sm'>{props.categories[0].name}</div>
              <div>·</div>
            </>
          )}
          {props.installed ? (
            <div className='flex flex-row items-center py-1 gap-1'>
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
        <div className='text-sm py-1 line-clamp-1'>
          {!!props.summary && props.summary}
        </div>
      </div>
    </Link>
  )
}
