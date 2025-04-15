import { formatHourMinute } from '../../utils/formatTime'
import MaterialIcon from '../common/MaterialIcon'

type TStatus = 'READY' | 'INPROGRESS' | 'SUCCESS' | 'FAILED'
type TData = { name: string; color: string }

export interface IPipelineIconProps {
  status: TStatus
  timestamp?: string
}

export default function PipelineIcon({
  status,
  timestamp,
}: IPipelineIconProps) {
  const iconData: Record<TStatus, TData> = {
    READY: {
      name: 'Pending',
      color: 'text-pwandora-gray',
    },
    INPROGRESS: {
      name: 'progress_activity',
      color: 'text-pwandora-gray animate-spin animate-pulse',
    },
    SUCCESS: {
      name: 'Check_circle',
      color: 'text-pwandora-green',
    },
    FAILED: {
      name: 'Cancel',
      color: 'text-pwandora-red',
    },
  }

  return (
    <div className='relative flex flex-col items-center z-1'>
      <MaterialIcon
        name={iconData[status].name}
        size='20px'
        className={`bg-white ${iconData[status].color}`}
        filled
      />
      {timestamp && (
        <div
          className={`absolute text-[0.6rem] top-4.5 ${iconData[status].color}`}
        >
          {formatHourMinute(timestamp)}
        </div>
      )}
    </div>
  )
}
