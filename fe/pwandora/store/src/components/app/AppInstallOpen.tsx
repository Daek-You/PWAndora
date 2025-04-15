import { useNativeFeature } from '@/contexts/NativeFeatureContext'
import useTemporaryPortal from '@/hooks/useTemporaryPortal'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export interface IAppInstallOpenProps {
  appDetail: {
    id: number
    name: string
    files: Array<{ fileType: string; downloadUrl: string }>
    appId: string
  }
}

export default function AppInstallOpen({ appDetail }: IAppInstallOpenProps) {
  const {
    installApp,
    installedApps,
    getIsInstalled,
    openAppByAppId,
    setOnDownloadProgress,
    setOnInstallAppComplete,
    setOnInstallAppProgress,
  } = useNativeFeature()
  const { showTemporaryElement, TemporaryPortal } = useTemporaryPortal()
  const { t } = useTranslation()

  const isInstalled = useMemo(
    () => getIsInstalled(appDetail.appId),
    [installedApps, appDetail.appId, getIsInstalled],
  )

  useEffect(() => {
    setOnDownloadProgress({
      execute: (progress: string) => {
        showTemporaryElement(`${t('Download progress')}: ${progress}`, 1500)
      },
    })
    setOnInstallAppProgress({
      execute: (percentage: string) => {
        showTemporaryElement(
          `${t('Install app progress')}: ${percentage}`,
          1500,
        )
      },
    })
    setOnInstallAppComplete({
      execute: (packageId: string) => {
        showTemporaryElement(
          `${t('Install app complete')}: ${appDetail.name} (${packageId})`,
          4000,
        )
      },
    })
  }, [])

  const install = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    installApp(appDetail.id, appDetail.files)
  }

  const openApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    openAppByAppId(appDetail.appId)
  }
  return (
    <div>
      <div className='ml-auto pr-[2%] flex flex-row justify-end'>
        {isInstalled ? (
          <button
            onClick={openApp}
            className='whitespace-nowrap min-w-20 text-primary-dark bg-white border-primary-dark border-2 py-2 px-3 rounded-full font-bold'
          >
            {t('Open')}
          </button>
        ) : (
          <button
            onClick={install}
            className='whitespace-nowrap min-w-20 bg-primary py-2 px-3 rounded-full text-white font-bold'
          >
            {t('Install')}
          </button>
        )}
      </div>
      <TemporaryPortal />
    </div>
  )
}
