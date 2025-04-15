import { useTranslation } from 'react-i18next'
import { useDashboardOverview } from '../../apis/crawler'
import Card from '../common/Card'
import CompletedList from './CompletedList'
import Progress from './Progress'

export default function SideCard() {
  const { data } = useDashboardOverview()
  const { t } = useTranslation()

  return (
    <Card className='flex flex-col gap-4 w-80'>
      {data && (
        <div className='grid grid-cols-3 gap-2 mb-9.5'>
          <Progress
            title={t('Processing')}
            {...data.processing}
            show='ratio'
            className='text-pwandora-primary'
          />
          <Progress
            title={t('PWAs')}
            {...data.pwas}
            show='value'
            className='black'
          />
          <Progress
            title={t('Success')}
            {...data.success}
            show='value'
            className='text-pwandora-green'
          />
        </div>
      )}
      <div className='text-md font-bold'>{t('Completed')}</div>
      <CompletedList />
    </Card>
  )
}
