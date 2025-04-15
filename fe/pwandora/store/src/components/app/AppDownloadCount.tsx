import { simpleLocaleNumber } from '@/utils/simpleLocaleNumber'
import MaterialIcon from '../MaterialIcon'
import { useTranslation } from 'react-i18next'

export interface IAppDownloadCountProps {
  downloadCount: number
  installed: boolean
}

export default function AppDownloadCount(props: IAppDownloadCountProps) {
  const { t } = useTranslation()
  return props.installed ? (
    <div className='flex flex-row items-center text-sm py-1'>
      <span className='font-bold text-sm'>{t('Installed')}</span>
      <MaterialIcon name='download_done' size='1.2rem' />
    </div>
  ) : (
    <div className='flex flex-row items-center py-1 '>
      <span className='font-bold text-sm'>
        {simpleLocaleNumber(props.downloadCount)}
      </span>
      <MaterialIcon name='download' filled size='1.2rem' />
    </div>
  )
}
