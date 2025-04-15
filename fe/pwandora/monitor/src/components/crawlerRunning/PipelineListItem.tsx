import { ISiteProcess } from '../../types/crawlerData'
import PipelineIcon from './PipelineIcon'
import { formatHourMinuteSecond } from '../../utils/formatTime'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PipelineListItem({
  url,
  timestamp,
  checkPWA,
  tizenPackaging,
  androidPackaging,
  takeScreenshots,
  aiDataGeneration,
}: ISiteProcess) {
  const [min, setMin] = useState(0)
  const [sec, setSec] = useState(0)

  const { t } = useTranslation()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const past = new Date(timestamp)
      const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000)
      setMin(Math.floor(diffSec / 60))
      setSec(diffSec % 60)
    }

    update()
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [timestamp])

  return (
    <div className='grid grid-cols-[200px_480px_1fr] items-center h-10.5 gap-12 text-sm h-8 border-t border-pwandora-foreground-gray truncate'>
      <div className='truncate'>{url}</div>
      <div className='grid grid-cols-5 gap-12 relative pb-1'>
        <hr className='absolute border-t border-dashed border-pwandora-gray w-[calc(100%-40px)] left-5 top-2.5' />
        <PipelineIcon {...checkPWA} />
        <PipelineIcon {...tizenPackaging} />
        <PipelineIcon {...androidPackaging} />
        <PipelineIcon {...takeScreenshots} />
        <PipelineIcon {...aiDataGeneration} />
      </div>
      <div className='text-pwandora-gray text-xs/4'>
        <div>{formatHourMinuteSecond(timestamp)}</div>
        <div>{`(${min ? `${min}${t('min')} ` : ''}${sec}${t('sec')} ${t(
          'ago',
        )})`}</div>
      </div>
    </div>
  )
}
