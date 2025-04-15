import LogListItem, { ILogListItemProps } from './LogListItem'
import DateSelector from '../common/DateSelector'
import { useTranslation } from 'react-i18next'
import Pagination from '../common/Pagination'
import { useLogsPipelines } from '../../apis/logs'
import { useSearchParams } from 'react-router'

export default function LogList() {
  const [searchParams] = useSearchParams()
  const { data: datas, isSuccess } = useLogsPipelines({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  })
  const page = Number(searchParams.get('page')) || 1
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between'>
        <div className='text-lg font-bold'>{t('Logs')}</div>
        <div>
          <DateSelector />
        </div>
      </div>
      {isSuccess ? (
        <>
          <div className='flex flex-col h-80 divide-y-1 divide-solid divide-pwandora-foreground-gray'>
            <div className='grid grid-cols-[160px_1fr_80px_80px_60px] items-center gap-4 text-sm h-8 font-bold'>
              <div>{t('Started At')}</div>
              <div> {t('Duration')}</div>
              <div>{t('Processed')}</div>
              <div>{t('PWAs')}</div>
              <div>{t('Error')}</div>
            </div>
            {datas.length > 0 ? (
              datas
                .filter(
                  (data: ILogListItemProps) =>
                    data.totalProcessed > 0 && data.executionTime > 5,
                )
                .slice((page - 1) * 9, page * 9)
                .map((data: ILogListItemProps) => (
                  <LogListItem key={data.pipelineId} {...data} />
                ))
            ) : (
              <div className='flex flex-1 items-center justify-center'>
                <div className='text-sm'>
                  {t('No records during this period')}
                </div>
              </div>
            )}
          </div>
          <div className='flex justify-center'>
            <Pagination
              totalPageCount={Math.ceil(
                datas.filter(
                  (data: ILogListItemProps) =>
                    data.totalProcessed > 0 && data.executionTime > 5,
                ).length / 9,
              )}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
