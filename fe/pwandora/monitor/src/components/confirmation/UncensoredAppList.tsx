import { useTranslation } from 'react-i18next'
import usePagination from '../../hooks/usePagenation'
import Card from '../common/Card'
import PagenationShort from '../common/PagenationShort'
import UncensoredAppItem from './UncensoredAppItem'
import { useUncensoredAppList } from '../../apis/confirmation'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ROUTES } from '../../consts/ROUTES'

export interface IUncensoredAppItem {
  id: number
  name: string
  webSiteUrl: string
}

export interface IUncensoredAppListProps {
  setNextAppId?: (id: number | undefined) => void
  setPrevAppId?: (id: number | undefined) => void
  landing?: boolean
}

export default function UncensoredAppList({
  setNextAppId,
  setPrevAppId,
  landing = false,
}: IUncensoredAppListProps) {
  const { appId } = useParams()
  const { currentPage, setCurrentPage } = usePagination(1)
  const { t } = useTranslation()
  const { data, isLoading, isError } = useUncensoredAppList({
    page: currentPage - 1,
    size: 15,
  })
  const route = useNavigate()

  useEffect(() => {
    if (!data) return
    const curIndex = data.content.findIndex(
      (app: IUncensoredAppItem) => app.id === Number(appId),
    )
    if (curIndex === -1) return
    const nextIndex = curIndex + 1 < data.content.length ? curIndex + 1 : -1
    const prevIndex = curIndex - 1 >= 0 ? curIndex - 1 : -1
    if (setNextAppId && setPrevAppId) {
      if (nextIndex !== -1) setNextAppId(data.content[nextIndex].id)
      else setNextAppId(undefined)
      if (prevIndex !== -1) setPrevAppId(data.content[prevIndex].id)
      else setPrevAppId(undefined)
    }
  }, [appId, data, setNextAppId, setPrevAppId])

  useEffect(() => {
    if (!data) return
    if (!landing) return
    route(
      ROUTES.CONFIRMATION_DETAIL.replace(
        ':appId',
        data.content[0].id.toString(),
      ),
    )
  }, [landing, data])

  if (isError) return <div className='p-8 pr-4'>Error...</div>

  const {
    content: uncensoredApps,
    total: totalCount,
    totalPageCount: totalPage,
  } = !isLoading ? data : { content: [], total: 0, totalPageCount: 0 }

  return (
    <div className='p-8 pr-4'>
      <Card className='w-[16vw] h-full min-w-48 flex flex-col justify-between'>
        <div className='flex flex-col p-2'>
          <h1 className='font-bold'>{t('Uncensored Apps')}</h1>
          <h1 className='font-bold'>
            <span className='underline'>{totalCount}</span> {t('apps left')}
          </h1>
        </div>
        <div className='h-full overflow-y-scroll no-scrollbar flex flex-col gap-1'>
          {uncensoredApps.map((app: IUncensoredAppItem, index: number) => (
            <UncensoredAppItem
              key={index}
              appName={app.name}
              appId={app.id}
              selected={!!appId && appId == app.id.toString()}
            />
          ))}
        </div>
        <PagenationShort
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage}
        />
      </Card>
    </div>
  )
}
