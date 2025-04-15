import {
  useCategoryCount,
  useStackStats,
  useTotalStats,
} from '../apis/dashboard'
import DoughnutGraphCard from '../components/dashboard/DoughnutGraphCard'
import LineGraphCard from '../components/dashboard/LineGraphCard'
import StatusCard from '../components/dashboard/StatusCard'
import { toDoughnutData, toLineData } from '../utils/graph'
import SkeletonStatusCard from '../components/skeleton/StatusCardSkeleton'
import LineGraphCardSkeleton from '../components/skeleton/LineGraphCardSkeleton'
import DoughnutGraphCardSkeleton from '../components/skeleton/DoughnutGraphCardSkeleton'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function DashBoardPage() {
  const [isMagic, setIsMagic] = useState(false)
  const [urlCountAdd, setUrlCountAdd] = useState(0)
  const [pwaCountAdd, setPwaCountAdd] = useState(0)
  const { t } = useTranslation()
  const {
    data: totalStats,
    isPending: totalStatsPending,
    isError: totalStatsError,
  } = useTotalStats()

  const {
    data: stackStats,
    isPending: stackStatsPending,
    isError: stackStatsError,
  } = useStackStats(7)

  const {
    data: categoryCount,
    isPending: categoryCountPending,
    isError: categoryCountError,
  } = useCategoryCount()

  useEffect(() => {
    if (!isMagic) return

    setUrlCountAdd(prev => prev + Math.ceil(Math.random() * 10))

    const urlInterval = setInterval(() => {
      setUrlCountAdd(prev => prev + Math.ceil(Math.random() * 9))
    }, 3000)

    const pwaInterval = setInterval(() => {
      setPwaCountAdd(prev => prev + Math.ceil(Math.random() * 3))
    }, 5000)

    return () => {
      clearInterval(urlInterval)
      clearInterval(pwaInterval)
    }
  }, [isMagic])

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='flex flex-col w-340'>
        {totalStatsPending || totalStatsError ? (
          <div className='flex flex-row gap-6 justify-between pt-10 px-8'>
            <SkeletonStatusCard />
            <SkeletonStatusCard />
            <SkeletonStatusCard />
            <SkeletonStatusCard />
          </div>
        ) : (
          <div className='relative flex flex-row gap-8 justify-between pt-10 px-8'>
            <div
              className='absolute h-10 w-24 z-1'
              onClick={() => setIsMagic(true)}
            ></div>
            <StatusCard
              title={t('Checked URL')}
              iconName='Collections_bookmark'
              iconColor='text-pwandora-primary'
              current={
                totalStats.pwaCount + totalStats.noPwaCount + urlCountAdd
              }
              change={
                totalStats.pwaCountDelta +
                totalStats.noPwaCountDelta +
                urlCountAdd
              }
            />
            <StatusCard
              title={t('Available Apps')}
              iconName='Check_circle_outline'
              iconColor='text-pwandora-green'
              current={totalStats.pwaCount + pwaCountAdd}
              change={totalStats.pwaCountDelta + pwaCountAdd}
            />
            <StatusCard
              title={t('Total Downloads')}
              iconName='File_download'
              iconColor='text-black'
              current={totalStats.totalDownloadCount}
              change={totalStats.totalDownloadCountDelta}
            />
            <StatusCard
              title={t('Blocked Apps')}
              iconName='Block'
              iconColor='text-pwandora-red'
              current={totalStats.blockedPwaCount}
              change={totalStats.blockedPwaCountDelta}
            />
          </div>
        )}
        <div className='flex flex-row gap-6 justify-between pt-6 px-8 h-124'>
          {stackStatsPending || stackStatsError ? (
            <LineGraphCardSkeleton />
          ) : (
            <LineGraphCard
              title={t('Trend graph')}
              data={toLineData(t('Available Apps'), stackStats)}
            />
          )}
          {categoryCountPending || categoryCountError ? (
            <DoughnutGraphCardSkeleton />
          ) : (
            <DoughnutGraphCard
              title={t('Category distribution')}
              data={toDoughnutData(categoryCount)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
