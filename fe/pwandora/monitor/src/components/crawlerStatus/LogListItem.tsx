import { Link, useParams, useSearchParams } from 'react-router'
import { ROUTES } from '../../consts/ROUTES'
import { parseSecondsToHMS } from '../../utils/formatTime'
import { useTranslation } from 'react-i18next'

export interface ILogListItemProps {
  pipelineId: number
  inProgressTimestamp: string
  finishedTimestamp: string
  executionTime: number
  noPwaCount: number
  savedPwaCount: number
  errorCount: number
  totalProcessed: number
}

export default function LogListItem({
  pipelineId,
  inProgressTimestamp,
  executionTime,
  savedPwaCount,
  errorCount,
  totalProcessed,
}: ILogListItemProps) {
  const { runId } = useParams()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  return (
    <Link
      to={`${ROUTES.CRAWLER_STATUS}/${pipelineId}?${searchParams.toString()}`}
      className={`grid grid-cols-[160px_1fr_80px_80px_60px] items-center gap-4 text-sm h-8 ${
        runId === String(pipelineId)
          ? 'bg-pwandora-foreground-gray font-semibold'
          : 'hover:bg-pwandora-foreground-gray'
      }`}
    >
      <div>{inProgressTimestamp.split('T').join(' ')}</div>
      <div>
        {parseSecondsToHMS(executionTime, t('hours'), t('min'), t('sec'))}
      </div>

      <div>{totalProcessed}</div>
      <div>{savedPwaCount}</div>
      <div>{errorCount}</div>
    </Link>
  )
}
