import UncensoredAppList from '../components/confirmation/UncensoredAppList'
import ConfirmAppDetail from '../components/confirmation/appData/ConfirmAppDetail'
import { useState } from 'react'

export default function ConfirmationPage() {
  const [nextAppId, setNextAppId] = useState<number | undefined>()
  const [prevAppId, setPrevAppId] = useState<number | undefined>()

  return (
    <main className='flex h-[86vh]'>
      <UncensoredAppList
        setNextAppId={setNextAppId}
        setPrevAppId={setPrevAppId}
      />
      <ConfirmAppDetail nextAppId={nextAppId} prevAppId={prevAppId} />
    </main>
  )
}
