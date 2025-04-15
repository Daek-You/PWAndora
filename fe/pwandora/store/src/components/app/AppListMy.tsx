import { useMyApps } from '@/apis/app'
import { useNativeFeature } from '@/contexts/NativeFeatureContext'
import { IAppListItem } from '@/types/IAppListItem'
import { useTranslation } from 'react-i18next'
import AppItemMy from './AppItemMy'

export default function AppListMy() {
  const { getIsInstalled } = useNativeFeature()
  const { data: myApps, isPending, isError } = useMyApps()
  const { t } = useTranslation()

  if (isPending) return <div>{t('Loading')}</div>
  if (isError) return <div>{t('Error')}</div>

  // scroll 기능
  return (
    <div className='flex flex-col gap-2 overflow-scroll'>
      {myApps.length === 0 && <div>{t('No results')}</div>}
      {/* {<AppItemMy
        {...testApp}
        key={testApp.id}
        installed={getIsInstalled(testApp.appId)}
      />} */}
      {myApps.map((app: IAppListItem) => (
        <AppItemMy
          {...app}
          key={app.id}
          installed={getIsInstalled(app.appId)}
        />
      ))}
    </div>
  )
}
