import { downloadPwa } from '@/apis/app'
import { INativeMessageHandler } from '@/types/INativeMessageHandler'
import React, { createContext, useState, useEffect, useContext } from 'react'

declare global {
  interface Window {
    Native?: {
      getInstalledApps?: () => any
      openApp?: (packageName: string) => void
      installApp?: (url: string) => void
      getPlatform?: () => string
    }
  }
}

interface INativeContext {
  installedApps: any[]
  fetchInstalledApps: () => void
  openAppByAppId: (appId: string) => void
  getIsInstalled: (appId: string) => boolean
  installApp: (
    pwaId: number,
    files: { downloadUrl: string; fileType: string }[],
  ) => void
  renderInstalledApps: () => React.ReactNode
  getPlatform: () => string
  setOnDownloadProgress: React.Dispatch<
    React.SetStateAction<{ execute: (_progress: string) => void }>
  >
  setOnInstallAppProgress: React.Dispatch<
    React.SetStateAction<{ execute: (_percentage: string) => void }>
  >
  setOnInstallAppComplete: React.Dispatch<
    React.SetStateAction<{ execute: (_packageId: string) => void }>
  >
}

const NativeFeatureContext = createContext<INativeContext | undefined>(
  undefined,
)

interface INativeFeatureProviderProps {
  children: React.ReactNode
}

const NativeFeatureProvider = ({ children }: INativeFeatureProviderProps) => {
  const [installedApps, setInstalledApps] = useState<any[]>([])
  const [platform, setPlatform] = useState<string>('none')
  const [onDownloadProgress, setOnDownloadProgress] =
    useState<INativeMessageHandler>({
      execute: (_data: string) => {},
    })
  const [onInstallAppProgress, setOnInstallAppProgress] =
    useState<INativeMessageHandler>({
      execute: (_data: string) => {},
    })
  const [onInstallAppComplete, setOnInstallAppComplete] =
    useState<INativeMessageHandler>({
      execute: (_data: string) => {},
    })

  useEffect(() => {
    console.log('handler changed.')
    console.log(onDownloadProgress)
    console.log(onInstallAppProgress)
    console.log(onInstallAppComplete)

    const handleMessage = (event: MessageEvent) => {
      console.log('[React] Received message:', JSON.stringify(event.data))

      switch (event.data?.type) {
        case 'INSTALLED_APPS':
          console.log('Received installed apps:')
          event.data.apps.forEach((app: any) => {
            console.log(JSON.stringify(app))
          })
          setInstalledApps(event.data.apps)
          break
        case 'PLATFORM':
          setPlatform(event.data.platform)
          break
        case 'DOWNLOAD_APP_PROGRESS':
          onDownloadProgress.execute(event.data.progress)
          break
        case 'INSTALL_APP_PROGRESS':
          onInstallAppProgress.execute(event.data.percentage)
          break
        case 'INSTALL_APP_COMPLETE':
          fetchInstalledApps()
          onInstallAppComplete.execute(event.data.packageId)
          break
        default:
          console.log('[React] Unknown message type:', event.data.type)
          break
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onDownloadProgress, onInstallAppProgress, onInstallAppComplete])

  useEffect(() => {
    if (window.Native?.getPlatform) setPlatform(window.Native.getPlatform())
    const platformInterval = setInterval(() => {
      window.postMessage({ type: 'GET_PLATFORM' }, '*')
      if (platform !== 'none') clearInterval(platformInterval)
    }, 3000)
    return () => {
      clearInterval(platformInterval)
    }
  }, [platform])

  useEffect(() => {
    if (platform !== 'web') fetchInstalledApps()
  }, [platform])

  const renderInstalledApps = () => {
    return installedApps.map((app, index) => (
      <div key={index}>
        <p>{app.appId}</p>
        <p>{app.packageName}</p>
      </div>
    ))
  }

  const getPlatform = (): string => platform

  const fetchInstalledApps = async () => {
    if (platform === 'tizen') {
      window.postMessage({ type: 'GET_INSTALLED_APPS' }, '*')
    } else if (window.Native?.getInstalledApps) {
      try {
        const result = await window.Native.getInstalledApps()
        setInstalledApps(
          typeof result === 'string' ? JSON.parse(result) : result,
        )
      } catch (error) {
        console.error('Failed to fetch installed apps:', error)
      }
    } else {
      console.error('Native interface not available')
    }
  }

  const getIsInstalled = (appId: string): boolean => {
    return installedApps.some(app => app.packageName.includes(appId))
  }

  const openAppByAppId = (appId: string) => {
    const app = installedApps.find(app => app.packageName.includes(appId))
    if (!app) {
      console.error(`App "${appId}" is not installed.`)
      return
    }

    if (platform === 'tizen') {
      window.postMessage(
        { type: 'OPEN_APP', packageName: app.packageName },
        '*',
      )
    } else if (window.Native?.openApp) {
      window.Native.openApp(app.packageName)
    } else {
      console.error('Native interface not available')
    }
  }

  const installApp = async (
    pwaId: number,
    files: { downloadUrl: string; fileType: string }[],
  ) => {
    if (platform === 'tizen') {
      const file = files.find(file => file.fileType === 'WGT')
      if (!file) {
        console.error('WGT file not found')
        return
      }
      const url = file?.downloadUrl
      window.postMessage(
        {
          type: 'INSTALL_APP',
          url: url,
        },
        '*',
      )
      downloadPwa(pwaId, file.fileType)
    } else if (window.Native?.installApp) {
      const file = files.find(file => file.fileType === 'APK')
      if (!file) {
        console.error('APK file not found')
        return
      }
      const url = file?.downloadUrl
      window.Native.installApp(url)
      downloadPwa(pwaId, file.fileType)
    } else {
      console.error('Native interface not available')
    }
  }

  return (
    <NativeFeatureContext.Provider
      value={{
        installedApps,
        fetchInstalledApps,
        openAppByAppId,
        getIsInstalled,
        installApp,
        renderInstalledApps,
        getPlatform,
        setOnDownloadProgress,
        setOnInstallAppProgress,
        setOnInstallAppComplete,
      }}
    >
      {children}
    </NativeFeatureContext.Provider>
  )
}

const useNativeFeature = () => {
  const context = useContext(NativeFeatureContext)
  if (!context) {
    throw new Error(
      'useNativeFeature must be used within an NativeFeatureProvider',
    )
  }
  return context
}

export { NativeFeatureProvider, useNativeFeature }
