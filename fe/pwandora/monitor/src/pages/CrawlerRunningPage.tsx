import { useQueryClient } from '@tanstack/react-query'
import MainCard from '../components/crawlerRunning/MainCard'
import SideCard from '../components/crawlerRunning/SideCard'
import { useEffect } from 'react'
import { setCrawlerSSE } from '../utils/setCrawlerSSE'

export default function CrawlerRunningPage() {
  const queryClient = useQueryClient()

  useEffect(() => {
    setCrawlerSSE(queryClient)
  }, [queryClient])

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='flex gap-4 mt-6 w-320 h-160'>
        <SideCard />
        <MainCard />
      </div>
    </div>
  )
}
