import { useState, useEffect } from 'react'
import { usePipelineStatus } from '../../apis/crawler'
import SpinningLoader from '../common/SpinningLoader'
import { formatDateTime } from '../../utils/formatTime'
import { useTranslation } from 'react-i18next'

export default function MainTitle() {
  const { data } = usePipelineStatus()
  const { t } = useTranslation()

  const [hour, setHour] = useState(0)
  const [min, setMin] = useState(0)

  useEffect(() => {
    const update = () => {
      if (!data.startedAt) return

      const now = new Date()
      const past = new Date(data.startedAt)
      const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000)
      const diffMin = Math.floor(diffSec / 60)
      setHour(Math.floor(diffMin / 60))
      setMin(Math.floor(diffMin % 60))
    }

    update()
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [data])
  return (
    <div className='flex justify-between pt-2'>
      <div className='flex gap-2 items-center'>
        <div className='text-md font-bold'>
          {`${
            data.status === 'INPROGRESS'
              ? t('App Register Crawler Running')
              : t('App Register Crawler Not Running')
          }`}
        </div>
        {data.status === 'INPROGRESS' && <SpinningLoader size={4} />}
      </div>
      {data.status === 'INPROGRESS' && (
        <div className='flex gap-2 items-center text-sm'>
          <div className='font-bold'>수집 시작 시간</div>
          <div>{formatDateTime(data.startedAt)}</div>
          <div>{`(${hour ? `${hour}${t('hour')} ` : ''}${min}${t('min')} ${t(
            'ago',
          )})`}</div>
        </div>
      )}
    </div>
  )
}
