import MaterialIcon from '../common/MaterialIcon'
import Card from '../common/Card'
import SlideNumber from './SlideNumber'
import { useTranslation } from 'react-i18next'

export interface IStatusCardProps {
  title: string
  iconName: string
  iconColor: string
  current: number
  change: number
}

const StatusCard = ({
  title,
  iconName,
  iconColor,
  current,
  change,
}: IStatusCardProps) => {
  const { t } = useTranslation()

  return (
    <Card className='flex flex-col gap-2 flex-1'>
      <div className='flex justify-between'>
        <div className='flex flex-1 flex-col gap-2'>
          <div className='text-sm font-semibold pb-2'>{title}</div>
          <SlideNumber value={current} />
        </div>
        <MaterialIcon name={iconName} size='32px' className={iconColor} />
      </div>
      <div className='flex flex-row items-center gap-2'>
        {change > 0 && (
          <div className='flex flex-row items-center text-pwandora-green'>
            <MaterialIcon name='arrow_upward_alt' size='20px' />
            <div>{`${change.toLocaleString()} ${t('up')}`}</div>
          </div>
        )}
        {change == 0 && (
          <div className='flex flex-row items-center text-pwandora-gray'>
            <MaterialIcon name='check_indeterminate_small' size='20px' />
            <div>{t('same')}</div>
          </div>
        )}
        {change < 0 && (
          <div className='flex flex-row items-center text-pwandora-red'>
            <MaterialIcon name='arrow_downward_alt' size='20px' />
            <div>
              {`${Math.abs(change).toLocaleString()} ${t('down')}`} down
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatusCard
