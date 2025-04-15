import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import AppItem from '../components/app/AppItem'
import { useSearchPwas } from '@/apis/app'
import { IAppListItem } from '@/types/IAppListItem'
import { useTranslation } from 'react-i18next'
import EventBanner from '@/components/event/EventBannerList'

export default function AppsPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [appsParams, setAppsParams] = useState({
    sortCriteria: searchParams.get('sortCriteria') || 'createdAt',
    sortDirection: searchParams.get('sortDirection') || 'DESC',
    name: searchParams.get('name') || '',
    category: searchParams.get('category') || undefined,
  })

  useEffect(() => {
    setAppsParams({
      sortCriteria: searchParams.get('sortCriteria') || 'createdAt',
      sortDirection: searchParams.get('sortDirection') || 'DESC',
      name: searchParams.get('name') || '',
      category: searchParams.get('category') || undefined,
    })
  }, [searchParams])

  const {
    data: apps,
    isPending,
    isError,
    fetchNextPage,
    isFetching,
  } = useSearchPwas({ ...appsParams })
  console.log(apps)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollTop + clientHeight + 500 >= scrollHeight && !isFetching) {
      fetchNextPage()
    }
  }

  if (isPending) return <div>{t('Loading')}</div>
  if (isError) return <div>{t('Error')}</div>

  return (
    <div
      className='flex flex-col gap-2 overflow-y-scroll no-scrollbar'
      onScroll={handleScroll}
    >
      <EventBanner />
      {apps.pages[0].content.length === 0 && <div>{t('No results')}</div>}
      {apps.pages.map(page =>
        page.content.map((app: IAppListItem) => (
          <AppItem {...app} key={app.id} />
        )),
      )}
    </div>
  )
}
