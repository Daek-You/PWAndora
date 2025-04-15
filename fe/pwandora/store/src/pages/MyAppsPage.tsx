import Profile from '@/components/Profile'
import AppListMy from '@/components/app/AppListMy'

export interface IInstalledApp {
  appName: string
  packageName: string
}

export default function MyAppsPage() {
  return (
    <div className='flex flex-col h-full'>
      <Profile />
      <AppListMy />
    </div>
  )
}
